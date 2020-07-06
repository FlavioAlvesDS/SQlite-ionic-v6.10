import { Component, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ToastService } from '../service/toast.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nome: string;
  rm: string;
  create: Promise<SQLiteObject>;
  alunos = new Array();
  db: SQLiteObject;

  constructor(
    private sqlite: SQLite,
    private toast: ToastService,
    private alertCtrl: AlertController,
  ) {
    // Adcionando a função create em uma variavel para evitar a repetição de codigo 
    this.create = this.sqlite.create({
      name: 'etec.db',
      location: 'default'
    })
  }

  ngOnInit() {
      this.criarTabela();
      this.listarAlunos();
  }

  //  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // METODO PARA CRIAÇÃO DA TABELA
  criarTabela() {
    this.create.then((db: SQLiteObject) => {
      db.executeSql('create table if not exists alunos(' +
        'id INTEGER PRIMARY KEY,' +
        'nome VARCHAR(32),' +
        'rm VARCHAR(6)' +
        ')', [])
        .then(() => this.toast.showToast("Tabela Alunos criada  !", 3000, "success"))
    })
      .catch(() => this.toast.showToast("Erro ao criar a tabela aluno !", 3000, "danger"));
  }
  //  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // metodo para cadastrar um novo aluno
  cadastrarAluno(nome: string, rm: string) {
    let data = [
      nome,
      rm,
    ]
    // fazendo a verificação se os campos foram ´preenchidos corretamente
    if (nome == "" || nome == null || rm == "" || rm == null) {
      alert("Todos os campos devem ser preenchidos");
    } else {
      if (rm.length > 6) {
        alert("O campo rm devem ter no maximo de 6 caracters");
      } else {
        // a declaração create do SQLITE foi adicionada a propriedade this.create
        this.create.then((db: SQLiteObject) => {
          db.executeSql('INSERT INTO alunos ("nome","rm") VALUES(?,?)', data)
            .then(() => this.toast.showToast(" Aluno inserido com sucesso !", 2000, "success"))
            .catch(() => this.toast.showToast("Erro na inserção do aluno Aluno !", 3000, "danger"));
        })
          .catch(() => this.toast.showToast("Erro de conexão com o banco!", 3000, "danger"));

        this.nome = ""
        this.rm = ""
      }
      this.listarAlunos();
    }
  }


  //  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // metodo alterar que sera chamado ao usuario pressionar o botão ok do alert de aleteração
  alterar(coluna: any, dados: any, id: any) {

    this.create.then((db: SQLiteObject) => {
      db.executeSql('UPDATE alunos SET ' + coluna + ' = "' + dados + '" WHERE id = ' + id + '', [])
        .then(() => this.toast.showToast(coluna + " alterado com sucesso !", 2000, "success"))
        .catch(() => this.toast.showToast("Erro na alteração do " + coluna + " Aluno !", 3000, "danger"));
    })
      .catch(() => this.toast.showToast("Erro de conexão com o banco!", 3000, "danger"));

    this.listarAlunos();

  }
  //  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // metodo para deletar dados da tabela aluno
  deletarAluno(id: any) {

    this.create.then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM alunos WHERE id = ' + id + '', [])
        .then(() => this.toast.showToast("Aluno deletado com sucesso !", 2000, "success"))
        .catch(() => this.toast.showToast("Erro ao deletar Aluno !", 3000, "danger"));
    })
      .catch(() => this.toast.showToast("Erro de conexão com o banco!", 3000, "danger"));

    this.listarAlunos();

  }


  //  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // metodo para listar os alunos cadastrados na base de dados 
  listarAlunos() {
    this.alunos = [];
    // a declaração create do SQLITE foi adicionada a propriedade this.create
    this.create.then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM alunos', [])
        .then((data) => {
          for (let i = 0; i < data.rows.length; i++) {
            let item = data.rows.item(i)
            this.alunos.push(item);
          }
        })
        .catch(() => this.toast.showToast("Erro ao buscar  Alunos !", 3000, "danger"));
    })
      .catch(() => this.toast.showToast("Erro de conexão com o banco!", 3000, "danger"));

  }

  //  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // alert que contem o formulario para alteração dos dados do aluno
  async alertAlterar(coluna: any,value:any, id: any) {
      const alert = await this.alertCtrl.create({
        header: 'Editar Aluno',
        message: coluna+' - '+value,
        inputs: [
          {
            name: 'dados',
            type: 'text',
            placeholder: 'Informe o dado a ser alterado'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              
            }
          }, {
            text: 'Salvar',
            handler: (NewDados) => {
              this.alterar(coluna,NewDados.dados,id);
            }
          }
        ]
      });
  
      await alert.present();
    }

  
  //  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // METODO PARA DELETAR A TABELA
  deletarTabela() {
    this.create.then((db: SQLiteObject) => {
      db.executeSql('DROP TABLE alunos', [])
        .then(() => this.toast.showToast("Tabela Alunos exluida  !", 3000, "success"))
    })
      .catch(() => this.toast.showToast("Erro ao deletar a tabela aluno !", 3000, "danger"));
    this.alunos = [];
  }

}
