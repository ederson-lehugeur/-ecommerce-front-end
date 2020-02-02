import { ImageUtilService } from './../image-util.service';
import { StorageService } from './../storage.service';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public imageUtilService: ImageUtilService
    ) { }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?email=${email}`);
    }

    getImageFromBucket(id: string): Observable<any> {
        const url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`

        return this.http.get(url, { responseType: 'blob' });
    }

    insert(cliente: ClienteDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            cliente,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    uploadPicture(picture) {
        const pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        const formData: FormData = new FormData();

        formData.set('file', pictureBlob, 'file.png');

        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }
}