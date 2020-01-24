import { API_CONFIG } from './../../config/api.config';
import { ProdutoDTO } from './../../models/produto.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoService } from '../../services/domain/produto.service';

/**
 * Generated class for the ProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  itens: ProdutoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService
  ) {}

  ionViewDidLoad() {
    const categoriaId = this.navParams.get('categoriaId');
    this.produtoService.findByCategoria(categoriaId)
      .subscribe(response => {
        this.itens = response['content'];
        this.loadImageUrls();
      },
      error => {});
  }

  loadImageUrls() {
    this.itens.map(item => {
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        error => {});
    });
  }

  showDetail(produtoId: string) {
    this.navCtrl.push('ProdutoDetailPage', { produtoId: produtoId });
  }

}
