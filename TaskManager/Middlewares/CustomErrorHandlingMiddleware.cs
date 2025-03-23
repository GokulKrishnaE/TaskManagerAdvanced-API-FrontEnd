using System.Net;

namespace TaskManager.Middlewares
{
    public class CustomErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomErrorHandlingMiddleware> _logger;

        public CustomErrorHandlingMiddleware(RequestDelegate next, ILogger<CustomErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                // Call the next middleware in the pipeline
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                // Handle the exception and log it
                _logger.LogError(ex, "An unexpected error occurred.");

                // Return a generic error response
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Set status code
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Write error message to the response body (you can customize this)
            return context.Response.WriteAsync(new
            {
                message = "An unexpected error occurred. Please try again later.",
                detail = exception.Message
            }.ToString());
        }
    }
}
