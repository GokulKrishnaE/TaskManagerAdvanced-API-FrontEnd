using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManager.Data;
using TaskManager.Data.Seeders;
using TaskManager.Mappers;
using TaskManager.Models;
using TaskManager.Helpers;
using TaskManager.Middlewares;
using Microsoft.AspNetCore.Authorization;
using TaskManager.Authorization;
using System.Security.Claims;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Configuration
builder.Services.AddDbContext<TaskManagerDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity Configuration
builder.Services.AddIdentity<ApplicationUser, Role>()
    .AddEntityFrameworkStores<TaskManagerDBContext>()
    .AddDefaultTokenProviders();

// AutoMapper Configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register Repositories & Services
builder.Services.AddServices();

// Register Custom Authorization Handler
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") // Allow Angular frontend
                  .AllowAnyMethod()
                  .AllowAnyHeader();
            // .AllowCredentials(); // Only use this if credentials are required
        });
});

// JWT Authentication Configuration
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT Key is missing or invalid in appsettings.json. It must be 32 bytes long.");
}
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // Return 401 instead of redirecting
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = false, // Enforce token expiration
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = key
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token successfully validated.");

                var identity = (ClaimsIdentity)context.Principal.Identity;
                foreach (var claim in identity.Claims)
                {
                    Console.WriteLine($"Claim: {claim.Type} = {claim.Value}");
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

//builder.Services.AddAuthorization(options =>
//{
//    options.DefaultPolicy = new AuthorizationPolicyBuilder()
//        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
//        .RequireAuthenticatedUser()
//        .Build();
//});

builder.Services.AddAuthorization(options =>
{
    foreach (var permission in Enum.GetValues(typeof(PermissionEnum)).Cast<PermissionEnum>())
    {
        options.AddPolicy(permission.ToString(), policy =>
            policy.Requirements.Add(new PermissionRequirement(permission.ToString())));
    }
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });


// Custom Authorization Policies
// builder.Services.AddAuthorization(options =>
// {
//     foreach (var permission in Enum.GetValues(typeof(PermissionEnum)).Cast<PermissionEnum>())
//     {
//         options.AddPolicy(permission.ToString(), policy =>
//             policy.Requirements.Add(new PermissionRequirement(permission.ToString())));
//     }
// });

var app = builder.Build();

// Seed roles and admin before running the app
using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    await DbSeeder.SeedRolesAndAdminAsync(serviceProvider);
}

// Configure Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseMiddleware<CustomErrorHandlingMiddleware>(); 
app.Use(async (context, next) =>
{
    var principal = context.User;
    if (principal?.Identity?.IsAuthenticated == false)
    {
        Console.WriteLine("Middleware: User is not authenticated.");
    }
    else
    {
        Console.WriteLine("Middleware: User is authenticated.");
    }

    await next();
});
app.UseHttpsRedirection();

app.UseRouting();
// Enable CORS
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


app.Run();