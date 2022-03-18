import { HttpClient, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SearchGIFResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[]=[];

  public resultados: Gif[]=[];

  get historial(){
    return [...this._historial];
  }

  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  //es igual a la línea superior  
  //if (localStorage.getItem('historial'))
  //  this._historial = JSON.parse(localStorage.getItem('historial')!);
  }

  buscarGifs(query: string){
    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,9);
      localStorage.setItem('historial',JSON.stringify(this._historial));
    }
    console.log(this._historial);

    //httpParams siempre pares de string
    let params = new HttpParams()
      .set('api_key',environment.apiKEY)
      .set('q',query)
      .set('limit','10');
    
    this.http.get<SearchGIFResponse>(`${environment.apiURL}/search`,{params})
      .subscribe((resultado)=>{
        this.resultados = resultado.data;
        localStorage.setItem('resultados',JSON.stringify(this.resultados));
    })

  }

}
