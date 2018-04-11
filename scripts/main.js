"use strict";
//Rock, paper, scissors
//Browser console Rock, Paper, Scissors game
//John Burns

//Use a look up table to pick a winner
//            Rock    Paper    Scissors
//  Rock      draw    lose     win
//  Paper     win     draw     lose
//  Scissors  lose    win      draw
const rules = {Rock: {Rock: "draw", Paper: "lose", Scissors: "win"},
        Paper: {Rock: "win", Paper: "draw", Scissors: "lose"},
        Scissors: {Rock: "lose", Paper: "win", Scissors: "draw"}};
const valid_choices = ["Rock", "Paper", "Scissors"];

function computerPlay() {
    let n = Math.floor(Math.random() * 3);
    return valid_choices[n];
}

//Play a single round and show the result
function playRound(playerSelection, computerSelection) {
    playerSelection = validatePlayerInput(playerSelection);
    if (!playerSelection) {
        return "Error! playerSelection must be one of rock, paper or scissors!";
    }

    let result = rules[playerSelection][computerSelection];

    return buildResultString(result, playerSelection, computerSelection);
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


//Helper functions

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

function validatePlayerInput(playerSelection) {
    playerSelection = capitalize(playerSelection);

    if (valid_choices.includes(playerSelection)) {
        return playerSelection;
    } else {
        return null;
    }
}

function buildResultString(result, playerSelection, computerSelection) {
    let result_string;
    switch (result) {
        case "win":
            result_string = "You win! " + playerSelection + " beats " + computerSelection + "!";
            break;
        case "draw":
            result_string = "Draw! You both chose " + playerSelection + ".";
            break;
        case "lose":
            result_string = "You lose! " + computerSelection + " beats " + playerSelection + "!";
            break;
        }
    return result_string;
}

function showWinner(playerWinCount, computerWinCount) {
    if (playerWinCount > computerWinCount){
        console.log("Congratulations! You won " + playerWinCount + " games to " + computerWinCount);
    } else if (computerWinCount > playerWinCount) {
        console.log("Sorry! You were beaten " + computerWinCount + " games to " + playerWinCount);
    } else {
        console.log("It's a draw!");
    }
}
