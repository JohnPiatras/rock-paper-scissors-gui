"use strict";
//Rock, paper, scissors
//John Burns

//Use a look up table to pick a winner
//            Rock    Paper    Scissors
//  Rock      draw    lose     win
//  Paper     win     draw     lose
//  Scissors  lose    win      draw
const rules = {rock: {rock: "draw", paper: "lose", scissors: "win"},
        paper: {rock: "win", paper: "draw", scissors: "lose"},
        scissors: {rock: "lose", paper: "win", scissors: "draw"}};
const valid_choices = ["rock", "paper", "scissors"];



//declare some globals
let game_state = "";
let player_choice = "";
let computer_choice = "";
let player_sprite;
let computer_sprite;
let player_score;
let computer_score;
let rounds_played; //use -1 to indicate no games have been played yet

//persistent settings
let music_on;

initialise();

function initialise(){
    loadSettings();

    player_sprite = document.getElementById("player-sprite");
    computer_sprite = document.getElementById("computer-sprite");

    let bttns = document.querySelectorAll(".button");
    bttns.forEach((bttn) => bttn.addEventListener('click', onClickButton));

    let music_loop = document.getElementById("music-loop");
    music_loop.addEventListener("ended", gameStateChange);

    let music_finish = document.getElementById("music-finish");
    music_finish.loop = false;
    music_finish.addEventListener("ended", gameStateChange);

    document.getElementById("player-sprite").addEventListener("animationend", gameStateChange);

    rounds_played = -1;
    showDialogBox("Rock, paper scissors. Best of 5 rounds", "Play");
}

function loadSettings(){
	if(!localStorage.rps_settings_music){
		localStorage.rps_settings_music="true";
	}
	
	music_on = localStorage.rps_settings_music == "true";
	setMusicState(music_on);
}

function saveSettings(){
	localStorage.rps_settings_music = music_on;
}

function clearClassList(element){
    let classList = element.classList;
    while(classList.length > 0){
        classList.remove(classList.item(0));
    }
}

function resetGame(){
    player_score = 0;
    computer_score = 0;
    rounds_played = 0;
    updateScore();
    resetRound();
}

function resetRound(){
    game_state = "idle";
    player_choice = "";
    computer_choice = "";

    clearClassList(player_sprite);
    clearClassList(computer_sprite);
    player_sprite.classList.add("player-sprite-idle");
    computer_sprite.classList.add("computer-sprite-idle");

    document.getElementById("dialog-box").classList.add("hide");
    document.getElementById("hand-buttons").classList.remove("hide");

    let music_loop = document.getElementById("music-loop");
    music_loop.loop = true;
    if(music_on)music_loop.play();

    updateScore();
}

function updateScore(){
    let score = document.querySelector("#score h3");
    score.textContent = player_score + " : " + computer_score;

    document.querySelector("#score h2").textContent = "Round " + (rounds_played + 1);
}

function showDialogBox(text, bttn_text){
    let box = document.getElementById("dialog-box");
    box.children[0].textContent = text;
    box.children[1].textContent = bttn_text;
    box.classList.remove("hide");
}

//Event handlers


function onClickButton(e){
    let id = e.target.getAttribute('id');
    switch(id){
        case "rock-bttn":
            console.log("rock button clicked");
            player_choice = "rock";
            document.getElementById("hand-buttons").classList.add("hide");
            gameStateChange();
            break;
        case "scissors-bttn":
            console.log("Scissors button clicked");
            player_choice = "scissors";
            document.getElementById("hand-buttons").classList.add("hide");
            gameStateChange();
            break;
        case "paper-bttn":
            console.log("Paper button clicked");
            player_choice = "paper";
            document.getElementById("hand-buttons").classList.add("hide");
            gameStateChange();
            break;
        case "continue-bttn":
            if(rounds_played >= 0 && rounds_played < 5)
                resetRound();
            else   
                resetGame();
            break;
        case "music-bttn":
            setMusicState(!music_on);
         break;
    }
    
}

function setMusicState(state){
    music_on = state;
    if(music_on){
        document.getElementById("music-loop").play();
        document.getElementById("music-bttn").classList.remove("music-bttn-off");
    }else{
        document.getElementById("music-loop").pause();
        document.getElementById("music-bttn").classList.add("music-bttn-off");
    }
    saveSettings();   
}


function gameStateChange(e){
    switch(game_state){
        case "idle":
            console.log("State: " + game_state);
            document.getElementById("music-loop").loop = false;

            if(music_on){
                game_state = "roundStart";
            }else{
                game_state = "roundPlay";
                //we don't have the ended event of music-loop to fire this again so do it here
                gameStateChange();
            }
            console.log("    New state: " + game_state);
            break;

        case "roundStart":
            console.log("State: " + game_state);   
            game_state = "roundPlay";
            console.log("    New state: " + game_state);
            document.getElementById("music-finish").play();
            break;

        case "roundPlay":
            console.log("State: " + game_state);   
            
            document.getElementById("snd-choose").play();
            player_sprite.classList.remove("player-sprite-idle");
            player_sprite.classList.add("player-sprite-choosing");
            computer_sprite.classList.remove("computer-sprite-idle");
            computer_sprite.classList.add("computer-sprite-choosing");

            //make the computers choice
            computer_choice = computerPlay();
            game_state = "roundResult";
            console.log("    New state: " + game_state);
            break;
        case "roundResult":
            console.log("State: " + game_state);   //switch to choosing
            player_sprite.classList.remove("player-sprite-choosing");
            player_sprite.classList.add("player-sprite-" + player_choice);
            computer_sprite.classList.remove("computer-sprite-choosing");
            computer_sprite.classList.add("computer-sprite-" + computer_choice);

            let outcome = rules[player_choice][computer_choice];
            if(outcome === "win"){
                player_score++;
                
            }else if(outcome === "lose"){                
                computer_score++;
            }

            updateScore();
            rounds_played++;
            if(rounds_played < 5){
                showOutcomeDialog(outcome);
            }else{  
                showGameOverDialog();
            }
            break;
    }
}

function showOutcomeDialog(outcome){
    switch(outcome){
        case "win":
            showDialogBox("Huh, you won this round...", "Continue");
            break;
        case "lose":
            showDialogBox("Haha, I win this round!", "Continue");
            break;
        case "draw":
            showDialogBox("It's a draw!", "Continue");
            break;
    }
}

function showGameOverDialog(){
    let text;
    if(player_score > computer_score){
        text = "Game Over! You won " + player_score + " to " + computer_score;
    }else if(computer_score > player_score){
        text = "Game Over! I won " + computer_score + " to " + player_score;
    }else{
        text = "Game Over! It's a draw!";
    }

    showDialogBox(text, "Play Again");
}


function computerPlay() {
    let n = Math.floor(Math.random() * 3);
    return valid_choices[n];
}
