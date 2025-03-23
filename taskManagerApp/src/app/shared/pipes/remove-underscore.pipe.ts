import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'remove_underscore'
})


export class RemoveUnderScorePipe implements PipeTransform{

    transform(value: any) {
        return value.replace("_", " ")
    }
}