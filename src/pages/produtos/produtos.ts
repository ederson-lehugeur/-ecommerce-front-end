import { API_CONFIG } from './../../config/api.config';
import { ProdutoDTO } from './../../models/produto.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  itens: ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    const categoriaId = this.navParams.get('categoriaId');
    const loader = this.presentLoading();
    this.produtoService.findByCategoria(categoriaId, this.page, 10)
      .subscribe(response => {
        const start = this.itens.length;
        this.itens = this.itens.concat(response['content']);
        const end = this.itens.length;
        console.log(this.page);
        console.log(this.itens);
        this.loadImageUrls(start, end);
        loader.dismiss();
      },
        error => {
          loader.dismiss();
        });
  }

  loadImageUrls(start: number, end: number) {
    this.itens.slice(start, end).map(item => {
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(() => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
          error => { });
    });
  }

  showDetail(produtoId: string) {
    this.navCtrl.push('ProdutoDetailPage', { produtoId: produtoId });
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();

    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.itens = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

}
