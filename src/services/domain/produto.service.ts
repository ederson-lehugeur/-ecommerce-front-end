import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ProdutoService {

    constructor(public http: HttpClient) {}

    findByCategoria(categoriaId: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/produtos?categorias=${categoriaId}`);
    }

    getSmallImageFromBucket(id: string) : Observable<any> {
        return this.http.get(`${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`,
            { responseType: 'blob' });
    }
}