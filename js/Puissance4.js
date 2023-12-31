import Player from './Player.js';

class Puissance4 {
  
  constructor(rows, cols, player1, player2) {
    // Instanciation des inputs
    this.rows = rows;
    this.cols = cols;
    this.player1 = player1;
    this.player2 = player2;
    
    // Tableau qui contient l'état du jeu:
    //   0: case vide
    //   1: pion du joueur 1
    //   2: pion du joueur 2
    this.board = Array(parseInt(this.rows));
    for (let i = 0; i < this.rows; i++) {
      this.board[i] = Array(parseInt(this.cols)).fill(0);
    }
    // Id du prochain joueur
    this.playerId = 1;

    // Nombre de coups joués
    this.moves = 0;

    /* un entier indiquant le gagnant:
        null: la partie continue
            0: la partie est nulle
            1: joueur 1 a gagné
            2: joueur 2 a gagné
    */
    this.winner = null;

    // L'élément du DOM où se fait l'affichage des indications de jeu
    this.playerNameDisplay= document.querySelector('#playerNameDisplay');
    this.playerNameDisplay.innerHTML=this.player1.name;
    this.playerNameDisplay.style.color=this.player1.color;
    this.gameTurnDisplay = document.querySelector('#gameTurnDisplay');
    this.gameTurnDisplay.innerHTML=this.moves+1;

    //Tableau de scores
    this.player1ScoreHead = document.querySelector('#player1ScoreHead');
    this.player1ScoreHeadSpan = document.querySelector('#player1ScoreHeadSpan');
    this.player1Score = document.querySelector('#player1Score');
    this.player2ScoreHead = document.querySelector('#player2ScoreHead');
    this.player2ScoreHeadSpan = document.querySelector('#player2ScoreHeadSpan');
    this.player2Score = document.querySelector('#player2Score');

    // Grille de jeu
    this.p4div = document.querySelector('#p4');

    // Gestion des clicks sur la grille click
    this.p4div.addEventListener('click', (event) => this.handle_click(event));

    // Affichage
    this.initEvents(); // Ajout de l'écouteur d'événements sur bouton reset
    this.render();
  }

  


  /* Methode qui affiche le jeu dans le DOM */
  render() {
    // Affichage tableau de scores
    player1ScoreHeadSpan.innerHTML=this.player1.name;
    player1ScoreHead.style.backgroundColor = this.player1.color;
    player1Score.innerHTML=this.player1.score;
    player1Score.style.backgroundColor = this.player1.color;
    player2ScoreHeadSpan.innerHTML=this.player2.name;
    player2ScoreHead.style.backgroundColor = this.player2.color;
    player2Score.innerHTML=this.player2.score;
    player2Score.style.backgroundColor = this.player2.color;

    // Construction de la <table>
    let table = document.createElement('table');
    for (let i = this.rows - 1; i >= 0; i--) {
      let tr = table.appendChild(document.createElement('tr'));
      for (let j = 0; j < this.cols; j++) {
        let td = tr.appendChild(document.createElement('td'));
        let color = this.board[i][j];
        if (color){
          if (parseInt(color) == 1){
            td.style.backgroundColor = this.player1.color;
          } else {
            td.style.backgroundColor = this.player2.color;
          }
        }
        td.dataset.column = j;
      }
    }

    // Affichage du joueur dont c'est le tour
    if (this.playerId == 2) {
      this.playerNameDisplay.innerHTML=this.player2.name
      this.playerNameDisplay.style.color=this.player2.color
      this.gameTurnDisplay.innerHTML=this.moves+1;
    } else {
      this.playerNameDisplay.innerHTML=this.player1.name
      this.playerNameDisplay.style.color=this.player1.color
      this.gameTurnDisplay.innerHTML=this.moves+1;
    }

    // Mise à jour du DOM
    this.p4div.innerHTML = '';
    this.p4div.appendChild(table);

  }
  
  /* Methode ajoute l'indice du joueur à la row/column du tableau */
  set(row, column, playerId) {
    // On colore la case
    this.board[row][column] = playerId;
    // On compte le coup
    this.moves++;
  }

  /* Méthode qui ajoute un pion dans la colonne et renvoie la ligne concernée */
  play(column) {
    // Trouver la première case libre dans la colonne
    let row;
    for (let i = 0; i < this.rows; i++) {
      if (this.board[i][column] == 0) {
        row = i;
        break;
      }
    }
    if (row === undefined) {
      return null;
    } else {
      // Effectuer le coup
      this.set(row, column, this.playerId);
      // Renvoyer la ligne où on a joué
      return row;
    }
  }
  
  /* Méthode qui gère les évenements au click
    Coloration de la cellule et enchainement sur suite partie ou affichage du résultat */
  handle_click(event) {
    // Vérifier si la partie est encore en cours
    if (this.winner !== null) {
      if (window.confirm("Game over!\n\nVoulez-vous faire une autre partie ?")) {
        this.reset();
        this.render();
      } else {
        location.reload();
      }
      return;
    }

    let column = event.target.dataset.column;
    // Si click valide on récupère la première ligne vide sinon on renvoie colonne pleine
    if (column !== undefined) {
      column = parseInt(column);
      let row = this.play(parseInt(column));
      
      if (row === null) {
        window.alert("Cette colonne est pleine !");
      } else {
        // Vérifier s'il y a un gagnant, ou si match nul
        if (this.win(row, column, this.playerId)) {
          this.winner = this.playerId;
        } else if (this.moves >= this.rows * this.columns) {
          this.winner = 0;
        }

        // Passer le tour : 3 - 2 = 1, 3 - 1 = 2
        this.playerId = 3 - this.playerId;

        // Mettre à jour l'affichage
        this.render()
        
        // Affiche nom du gagnant si la partie est finie
        switch (this.winner) {
          case 0: 
            window.alert("Match nul !!"); 
            break;
          case 1:
            this.player1.score ++;
            player1Score.innerHTML=this.player1.score;
            this.render();
            window.alert(this.player1.name + " gagne la partie !");
            break;
          case 2:
            this.player2.score ++;
            player2Score.innerHTML=this.player1.score;
            this.render();
            window.alert(this.player2.name + " gagne la partie !");
            break;
        }
      }
    }
  }

  /* Méthode qui vérifie si le coup dans la case `row`, `column` par
    le joueur `player` est un coup gagnant.
    Renvoie :
      true  : si la partie est gagnée par le joueur `player`
      false : si la partie continue */
  win(row, column, player) {
    // Horizontal
    let count = 0;
    for (let j = 0; j < this.cols; j++) {
      count = (this.board[row][j] == player) ? count+1 : 0;
      if (count >= 4) return true;
    }
    // Vertical
    count = 0;
    for (let i = 0; i < this.rows; i++) {
      count = (this.board[i][column] == player) ? count+1 : 0;
      if (count >= 4) return true;
    }
    // Diagonal
    count = 0;
    console.log(row);
    let shift = row - column;
    // for (let i = Math.max(shift, 0); i < Math.min(this.rows, this.cols + shift); i++) {
    for (let i = Math.max(shift, 0); i < this.rows; i++) {
      console.log('diagonal');
      count = (this.board[i][i - shift] == player) ? count+1 : 0;
      if (count >= 4) return true;
    }
    // Anti-diagonal
    count = 0;
    shift = row + column;
    for (let i = Math.max(shift - this.cols + 1, 0); i < Math.min(this.rows, shift + 1); i++) {
      console.log('anti-diagonal');
      count = (this.board[i][shift - i] == player) ? count+1 : 0;
      if (count >= 4) return true;
    }
    
    return false;
  }

  // Méthode qui vide le plateau et les compteurs à zéro
  reset() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = 0;
      }
    }
    this.moves = 0;
    this.winner = null;
  }

  // Méthode pour initialiser les événements
  initEvents() {
    const resetButton = document.querySelector('#gamePlayReset');
    resetButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.reset(); // Appelle la méthode reset() pour réinitialiser le jeu
      this.render();
    });
  }
}

// Export de la classe Puissance4
export default Puissance4;