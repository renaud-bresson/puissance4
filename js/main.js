import Puissance4 from "./Puissance4.js";
import Player from "./Player.js";

let p4;

function runGame() {
  const rows = document.querySelector('#rowsNumber').value;
  const cols = document.querySelector('#colsNumber').value;
  const name1 = document.querySelector('#player1name').value;
  const color1 = document.querySelector('#player1color').value;
  const name2 = document.querySelector('#player2name').value;
  const color2 = document.querySelector('#player2color').value;

  const player1 = new Player(name1, color1);
  const player2 = new Player(name2, color2);
  
  // Initialiser le jeu Puissance4
  p4 = new Puissance4(rows, cols, player1, player2);
  
  
}


// let resetButton = document.querySelector('#gamePlayReset');
// resetButton.addEventListener('click', function(e){
//   console.log(e);
//   p4.reset();
// })



const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Empêcher le formulaire de se soumettre automatiquement
  document.querySelector('#selectOptions').style.display = 'none'; // Masquer selectOptions
  document.querySelector('#gameSection').style.display = 'block'; // Afficher gameSection
  runGame(); // Appel de la fonction runGame pour exécuter le jeu
});