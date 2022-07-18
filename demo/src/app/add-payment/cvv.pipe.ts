import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "hide",
})
export class CvvPipe implements PipeTransform {
  transform(cvv: string): string {
    if(!cvv){
      cvv='';
    }
    return cvv.replace(/./g, "X");
  }
}
