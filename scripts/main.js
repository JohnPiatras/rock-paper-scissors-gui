"use strict";
//Rock, paper, scissors
//Browser console Rock, Paper, Scissors game
//John Burns

//Use a look up table to pick a winner
//            Rock    Paper    Scissors
//  Rock      draw    lose     win
//  Paper     win     draw     lose
//  Scissors  lose    win      draw
const rules = {rock: {rock: "draw", paper: "lose", scissors: "win"},
        Paper: {rock: "win", paper: "draw", scissors: "lose"},
        Scissors: {rock: "lose", paper: "win", scissors: "draw"}};
const valid_choices = ["rock", "paper", "scissors"];

initialise();
let game_state = "idle";
let player_choice = "";
let computer_choice = "";

function initialise(){
    let bttns = document.querySelectorAll(".button");
    bttns.forEach((bttn) => bttn.addEventListener('click', onClickButton));

    let music_loop = document.getElementById("music-loop");
    music_loop.loop = true;
    music_loop.play();
    //music_loop.addEventListener("ended", onEndedMusicLoop);
    music_loop.addEventListener("ended", gameStateChange);
    let music_finish = document.getElementById("music-finish");
    music_finish.loop = false;

    document.getElementById("music-finish").addEventListener("ended", gameStateChange);
    document.getElementById("snd-choose").addEventListener("ended", gameStateChange);

}


//Event handlers
function onClickButton(e){
    let id = e.target.getAttribute('id');
    document.getElementById("music-loop").loop = false;
    document.getElementById("hand-buttons").classList.add("hide");
    switch(id){
        case "rock-bttn":
            console.log("rock button clicked");
            player_choice = "rock";
            break;
        case "scissors-bttn":
            console.log("Scissors button clicked");
            player_choice = "scissors";
            break;
        case "paper-bttn":
            console.log("Paper button clicked");
            player_choice = "paper";
            break;
    }
}

function onEndedMusicLoop(e){
    console.log("onFinishMusicLoop() fired");
    document.getElementById("music-finish").play();
    doPlayersChoose();
}

function doPlayersChoose(){
    let snd = document.getElementById("snd_choose");
}

function onEndedPlayersChoose(){

}

function gameStateChange(e){
    let player_sprite = document.getElementById("player-sprite");
    let computer_sprite = document.getElementById("computer-sprite");
    switch(game_state){
        case "idle":
            console.log("State: " + game_state);
            game_state = "aboutToChoose";
            console.log("    New state: " + game_state);
            document.getElementById("music-loop").loop = false;
        case "aboutToChoose":
            console.log("State: " + game_state);   //switch to choosing
            game_state = "choosing";
            console.log("    New state: " + game_state);
            document.getElementById("music-finish").play();
            break;
        case "choosing":
            console.log("State: " + game_state);   //switch to choosing
            game_state = "roundEnded";
            console.log("    New state: " + game_state);
            document.getElementById("snd-choose").play();
            console.log("    start choosing animations here");

            player_sprite.classList.remove("player-sprite-idle");
            player_sprite.classList.add("player-sprite-choosing");
            computer_sprite.classList.remove("computer-sprite-idle");
            computer_sprite.classList.add("computer-sprite-choosing");

            //make the computers choice
            computer_choice = computerPlay();
            console.log("Switching to state roundEnded");
            break;
        case "roundEnded":
            console.log("State: " + game_state);   //switch to choosing
            player_sprite.classList.remove("player-sprite-choosing");
            player_sprite.classList.add("player-sprite-" + player_choice);
            computer_sprite.classList.remove("computer-sprite-choosing");
            computer_sprite.classList.add("computer-sprite-" + computer_choice);
            console.log("Reset round");
            break;
    }
}




function computerPlay() {
    let n = Math.floor(Math.random() * 3);
    return valid_choices[n];
}


//Play a game of 5 rounds and show the result.
function game() {
    let playerWinCount = 0;
    let computerWinCount = 0;
    for ( let round = 0; round < 5; round++ ) {
        let playerSelection = null;
        let computerSelection = computerPlay();

        while(!playerSelection){
            playerSelection = validatePlayerInput(window.prompt("Enter rock, paper or scissors:"));
        }

        let result = rules[playerSelection][computerSelection];

        if(result === "win") {
            playerWinCount++;
        } else if (result === "lose") {
            computerWinCount++;
        }

        console.log("Round " + (round + 1));
        console.log("    " + buildResultString(result, playerSelection, computerSelection));
    }
    showWinner(playerWinCount, computerWinCount);
}


