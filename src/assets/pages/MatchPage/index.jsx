import React, { useEffect, useState } from "react";
import { loadState, saveState } from "../../utils/localStorage";
import { use } from "react";

export default function MatchPage() {
  const [gameState, setGameState] = useState(
    () =>
      loadState()?.gameState || {
        score: [0, 0],
        server: 0,
        serverIndex: 2,
        servingSide: "right",
        history: [],
      }
  );

  const [players, setPlayers] = useState(
    () =>
      loadState()?.players || {
        player01: "",
        player02: "",
        player03: "",
        player04: "",
      }
  );

  const [gameRule, setGameRule] = useState(
    () =>
      loadState()?.gameRule || {
        type: "doubles",
        winBy: 2,
        totalGames: 3,
        targetScore: 11,
      }
  );
  useEffect(() => {
    const gameStateWithoutHistory = { ...gameState, history: [] };
    const state = {
      gameState: gameStateWithoutHistory,
      gameRule,
      players,
    };
    saveState(state);
  }, [gameState, gameRule, players]);
  // Save state mỗi lần thay đổi
  //   useEffect(() => {
  //     const state = {
  //       gameState,
  //       gameRule,
  //       players,
  //     };
  //     saveState(state);
  //   }, [gameState, gameRule, players]);
  //   --- Hiện điểm lên bảng ---
  function getCallOut() {
    return `${gameState.score[gameState.server]} - ${
      gameState.score[1 - gameState.server]
    } - ${gameState.serverIndex} `;
  }
  // Tấn công thành công
  function addScore() {
    setGameState((prev) => {
      const newScore = [...prev.score];
      const server = prev.server;
      newScore[server]++;
      // Kiểm tra thắng
      const s1 = newScore[0];
      const s2 = newScore[1];
      if (s1 >= gameRule.targetScore && s1 - s2 >= gameRule.winBy)
        showAlert("Team 1");
      else if (s2 >= gameRule.targetScore && s2 - s1 >= gameRule.winBy)
        showAlert("Team 2");
      const newState = {
        ...prev,
        score: newScore,
        servingSide: newScore[server] % 2 === 0 ? "right" : "left",
        history: [
          ...prev.history,
          {
            ...prev,
            score: [...prev.score], // clone mảng điểm
          },
        ],
      };

      return newState;
    });
  }
  // Tấn công thất bại
  function nextPlayer() {
    setGameState((prev) => {
      const server = prev.server;
      const newState = {
        ...prev,
        server: prev.server,
        serverIndex: prev.serverIndex === 1 ? 2 : 1,
        history: [
          ...prev.history,
          {
            ...prev,
            score: [...prev.score],
          },
        ],
      };

      // nếu chuyển đội
      if (prev.serverIndex === 2) {
        newState.server = 1 - server;
        newState.serverIndex = 1;
      }

      newState.servingSide =
        newState.score[newState.server] % 2 === 0 ? "right" : "left";

      return newState;
    });
  }
  //--- Undo ---
  function undo() {
    setGameState((prev) => {
      if (prev.history.length === 0) return prev;

      const lastState = prev.history[prev.history.length - 1];
      return {
        ...lastState,
        history: prev.history.slice(0, -1),
      };
    });
  }
  function showArrow() {
    if (gameState.server == 0 && gameState.servingSide === "left") {
      return <img src="./imgs/arrow01.png" className="" alt="" />;
    } else if (gameState.server == 0 && gameState.servingSide === "right") {
      return <img src="./imgs/arrow02.png" className="" alt="" />;
    } else if (gameState.server == 1 && gameState.servingSide === "left") {
      return <img src="./imgs/arrow03.png" className="" alt="" />;
    } else {
      return <img src="./imgs/arrow04.png" className="" alt="" />;
    }
  }
  function showPlayer() {
    if (gameState.server === 0) {
      if (gameState.serverIndex === 1) {
        return players.player01 !== "" ? players.player01 : "Player 01";
      } else {
        return players.player02 !== "" ? players.player02 : "Player 02";
      }
    } else {
      if (gameState.serverIndex === 1) {
        return players.player03 !== "" ? players.player03 : "Player 03";
      } else {
        return players.player04 !== "" ? players.player04 : "Player 04";
      }
    }
  }
  function handleOnChange(e) {
    const newPlayers = { ...players, [e.target.id]: e.target.value };
    setPlayers(newPlayers);
    console.log(newPlayers);
  }
  function handleOnBlur(e) {
    console.log("blur ne");
    e.target.value = e.target.value.trim();
  }
  // --- Modal winner ---
  const [winMessage, setWinMessage] = useState("");
  const [showModalWinner, setShowModalWinner] = useState(false);

  function showAlert(winner) {
    setWinMessage(`${winner} wins the match! 🏆`);
    setShowModalWinner(true);
  }
  // --- Modal setting ---
  const [showModalSetting, setShowModalSetting] = useState(true);
  function handleOnChangeSetting(e) {
    let newRule = {};
    if (e.target.name === "type") {
      newRule = { ...gameRule, [e.target.name]: e.target.value };
    } else {
      newRule = { ...gameRule, [e.target.name]: Number(e.target.value) };
    }
    setGameRule(newRule);
    console.log(newRule);
  }
  //   --- New Game ---
  function newGame() {
    const initState = {
      score: [0, 0],
      server: 0,
      serverIndex: 2,
      servingSide: "right",
      history: [],
    };

    setGameState(initState);
    saveState({
      gameState: initState,
      gameRule,
      players,
    });
    setShowModalSetting(false);
  }
  return (
    <div className="min-h-[100dvh]  w-screen bg-[#242c3b] ">
      <div className="container mx-auto">
        <div className="match__setting w-full sm:pt-[20px] text-right">
          <button
            className="text-white mr-[20px]"
            onClick={() => setShowModalSetting(true)}
          >
            <svg
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.1 9.2214C18.29 9.2214 17.55 7.9414 18.45 6.3714C18.97 5.4614 18.66 4.3014 17.75 3.7814L16.02 2.7914C15.23 2.3214 14.21 2.6014 13.74 3.3914L13.63 3.5814C12.73 5.1514 11.25 5.1514 10.34 3.5814L10.23 3.3914C9.78 2.6014 8.76 2.3214 7.97 2.7914L6.24 3.7814C5.33 4.3014 5.02 5.4714 5.54 6.3814C6.45 7.9414 5.71 9.2214 3.9 9.2214C2.86 9.2214 2 10.0714 2 11.1214V12.8814C2 13.9214 2.85 14.7814 3.9 14.7814C5.71 14.7814 6.45 16.0614 5.54 17.6314C5.02 18.5414 5.33 19.7014 6.24 20.2214L7.97 21.2114C8.76 21.6814 9.78 21.4014 10.25 20.6114L10.36 20.4214C11.26 18.8514 12.74 18.8514 13.65 20.4214L13.76 20.6114C14.23 21.4014 15.25 21.6814 16.04 21.2114L17.77 20.2214C18.68 19.7014 18.99 18.5314 18.47 17.6314C17.56 16.0614 18.3 14.7814 20.11 14.7814C21.15 14.7814 22.01 13.9314 22.01 12.8814V11.1214C22 10.0814 21.15 9.2214 20.1 9.2214ZM12 15.2514C10.21 15.2514 8.75 13.7914 8.75 12.0014C8.75 10.2114 10.21 8.7514 12 8.7514C13.79 8.7514 15.25 10.2114 15.25 12.0014C15.25 13.7914 13.79 15.2514 12 15.2514Z"
                fill="#ffffff"
              />
            </svg>
          </button>
        </div>
        <div className="w-full match__header">
          <div className="w-full text-center text-white text-[20px] font-[600]  ">
            Score Board
          </div>
          <div className="w-full text-center text-[40px] font-[600] text-white">
            {getCallOut()}
          </div>
        </div>
        <div className="match__map w-full sm:mt-[20px]">
          <div className="scale-75 sm:scale-100">
            <div className="bg-white max-w-[370px] h-[215px] mx-auto p-[5px]">
              <div className="grid grid-cols-10 gap-[5px] w-full relative">
                <div className="zone-1 col-span-4 h-[100px] bg-[#4183EB] relative">
                  {gameState.server == 0 &&
                    gameState.servingSide === "left" && (
                      <div className="w-full h-full bg-[#3812C3] flex justify-center items-start animate-fade-in">
                        <div className="mt-[10px] text-[16px] text-white font-[500] flex flex-col">
                          <div className="text-center">{showPlayer()} </div>
                          <div className="text-[12px] text-white/80 font-[500] text-center">
                            --- Left ---
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className="kitchen-1 col-span-1 h-[100px] bg-[#6EE876]"></div>
                <div className="kitchen-4 col-span-1 h-[100px] bg-[#6EE876]"></div>
                <div className="zone-4 col-span-4 h-[100px] bg-[#4183EB]">
                  {gameState.server == 1 &&
                    gameState.servingSide === "right" && (
                      <div className="w-full h-full bg-[#3812C3] flex justify-center items-start animate-fade-in">
                        <div className="mt-[10px] text-[16px] text-white font-[500] flex flex-col">
                          <div className="text-center">{showPlayer()} </div>
                          <div className="text-[12px] text-white/80 font-[500] text-center">
                            --- Right ---
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className="zone-2 col-span-4 h-[100px] bg-[#4183EB]">
                  {gameState.server == 0 &&
                    gameState.servingSide === "right" && (
                      <div className="w-full h-full bg-[#3812C3] flex justify-center items-start animate-fade-in">
                        <div className="mt-[10px] text-[16px] text-white font-[500] flex flex-col">
                          <div className="text-center">{showPlayer()} </div>
                          <div className="text-[12px] text-white/80 font-[500] text-center">
                            --- Right ---
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className="kitchen-1 col-span-1 h-[100px] bg-[#6EE876]"></div>
                <div className="kitchen-4 col-span-1 h-[100px] bg-[#6EE876]"></div>
                <div className="zone-3 col-span-4 h-[100px] bg-[#4183EB]">
                  {gameState.server == 1 &&
                    gameState.servingSide === "left" && (
                      <div className="w-full h-full bg-[#3812C3] flex justify-center items-start animate-fade-in">
                        <div className="mt-[10px] text-[16px] text-white font-[500] flex flex-col">
                          <div className="text-center">{showPlayer()} </div>
                          <div className="text-[12px] text-white/80 font-[500] text-center">
                            --- left ---
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className="arrow w-full h-full absolute top-0 left-0 flex opacity-50 justify-center items-center animate-fade-in">
                  <div className="scale-50">{showArrow()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="match__btn-group w-full sm:mt-[50px] px-[20px]">
          <div className="flex justify-center space-x-[24px]">
            <button
              disabled={gameState.server !== 0}
              onClick={addScore}
              className={`
                ${gameState.server === 0 && "active"}
                team1 btn-addPoint  w-[170px] py-[10px]  
            flex flex-col justify-center items-center
            `}
            >
              <div className="btn-addPoint__name text-[16px] sm:text-[20px] text-white font-[600]">
                Team 1
              </div>
              <div className="btn-addPoint__score text-[50px] text-white font-[600]">
                {gameState.score[0]}
              </div>
              <div className="btn-addPoint__add text-[16px] sm:text-[20px] text-white font-[600] mt-[10px]">
                ADD POINT
              </div>
            </button>
            <button
              disabled={gameState.server !== 1}
              onClick={addScore}
              className={`
                ${gameState.server === 1 && "active"}
                team1 btn-addPoint  w-[170px] py-[10px]  
            flex flex-col justify-center items-center
            `}
            >
              <div className="btn-addPoint__name text-[16px] sm:text-[20px] text-white font-[600]">
                Team 2
              </div>
              <div className="btn-addPoint__score text-[50px] text-white font-[600]">
                {gameState.score[1]}
              </div>
              <div className="btn-addPoint__add text-[16px] sm:text-[20px] text-white font-[600] mt-[10px]">
                ADD POINT
              </div>
            </button>
          </div>
          <div className="flex justify-center mt-[38px] ">
            <div className="relative z-50">
              <button
                className=" w-[160px] p-[10px]
            rounded-[10px] text-[15px] font-[600] text-black
            pk-bg-linear-green
            "
                onClick={() => nextPlayer()}
              >
                Next Server
              </button>
              <button
                className={`  
                absolute top-1/2 -translate-y-1/2 left-[-50px]
                p-[10px] 
            rounded-[10px] text-[15px] font-[600] text-white/80 hover:text-white
          
            ${gameState.history.length === 0 ? "opacity-50" : "opacity-100"}
            `}
                onClick={undo}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Edit / Undo">
                    <path
                      id="Vector"
                      d="M10 8H5V3M5.29102 16.3569C6.22284 17.7918 7.59014 18.8902 9.19218 19.4907C10.7942 20.0913 12.547 20.1624 14.1925 19.6937C15.8379 19.225 17.2893 18.2413 18.3344 16.8867C19.3795 15.5321 19.963 13.878 19.9989 12.1675C20.0347 10.4569 19.5211 8.78001 18.5337 7.38281C17.5462 5.98561 16.1366 4.942 14.5122 4.40479C12.8878 3.86757 11.1341 3.86499 9.5083 4.39795C7.88252 4.93091 6.47059 5.97095 5.47949 7.36556"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* <div
          className="match__players w-[323px] mx-auto mt-[50px] 
     grid grid-cols-2 gap-[24px]
        "
        >
          <div className="player01 flex items-center text-white">
            <div className="player__icon text-[#37B6E9]">
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-[8px]"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <input
              type="text"
              id="player01"
              placeholder="Player 01"
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className=" w-full
            bg-transparent
            "
            />
          </div>
          <div className="player04 flex items-center text-white justify-end">
            <div className="player__icon text-[#4B4CED]">
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-[8px]"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <input
              type="text"
              id="player04"
              placeholder="Player 04"
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className=" w-full
            bg-transparent
            "
            />
          </div>
          <div className="player02 flex items-center text-white">
            <div className="player__icon text-[#37B6E9]">
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-[8px]"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <input
              type="text"
              id="player02"
              placeholder="Player 02"
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className=" w-full
            bg-transparent
            "
            />
          </div>
          <div className="player03 flex items-center text-white justify-end">
            <div className="player__icon text-[#4B4CED]">
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-[8px]"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <input
              type="text"
              id="player03"
              placeholder="Player 03"
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              className=" w-full
            bg-transparent
            "
            />
          </div>
        </div> */}
      </div>
      {showModalWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-green-600">{winMessage}</h2>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setShowModalWinner(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showModalSetting && (
        <div className="absolute inset-0 z-50 bg-[#242c3b] sm:pt-[20px] overflow-x-hidden">
          <div className="container flex flex-col h-full relative mx-auto  z-50">
            <button
              className=" px-4 py-2  text-white rounded-lg
                absolute top-0 right-0 hover:bg-blue
            "
              onClick={() => setShowModalSetting(false)}
            >
              <svg
                fill="currentColor"
                height="24px"
                width="24px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 460.775 460.775"
                xml:space="preserve"
              >
                <path
                  d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                />
              </svg>
            </button>
            <h1
              className="md-setting__header
          mt-[30px] sm:mt-[56px] text-[20px] font-[600] text-white text-center
          "
            >
              Settings
            </h1>
            <div className="mt-[15px] relative flex-1 ">
              <div className="md-setting__form w-full rounded-t-[20px] h-full">
                <div className="max-w-[390px] w-full mx-auto  px-[12px] relative z-10">
                  <div className="w-full flex pt-[16px] justify-center ">
                    <div className="mr-[20px] py-[10px]">
                      <div className="text-white font-[600] text-[16px] flex justify-center ">
                        Team 1
                      </div>
                      <div className="max-w-[150px] mx-auto flex mt-[10px]">
                        <div className="player__icon text-[#37B6E9]">
                          <svg
                            width="32px"
                            height="32px"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-[8px]"
                          >
                            <path
                              d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>

                        <input
                          type="text"
                          id="player01"
                          placeholder="Player 01"
                          value={players.player01}
                          onChange={handleOnChange}
                          onBlur={handleOnBlur}
                          className=" w-full text-black text-[16px] font-[500]  bg-white rounded-r-[3px] pl-[5px]
                          focus:outline-none
                          "
                        />
                      </div>
                      <div
                        className="max-w-[150px] mx-auto  flex mt-[20px]
                    "
                      >
                        <div className="player__icon text-[#37B6E9]">
                          <svg
                            width="32px"
                            height="32px"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-[8px]"
                          >
                            <path
                              d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>

                        <input
                          type="text"
                          id="player02"
                          value={players.player02}
                          placeholder="Player 02"
                          onChange={handleOnChange}
                          onBlur={handleOnBlur}
                          className=" w-full text-black text-[16px] font-[500]  bg-white rounded-r-[3px] pl-[5px]
                          focus:outline-none
                          "
                        />
                      </div>
                    </div>
                    <div className="border-l-2 pl-[20px] py-[10px]">
                      <div className="text-white font-[600] text-[16px] text-center">
                        Team 2
                      </div>
                      <div className="max-w-[150px] mx-auto flex mt-[10px]">
                        <div className="player__icon text-[#37B6E9]">
                          <svg
                            width="32px"
                            height="32px"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-[8px]"
                          >
                            <path
                              d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>

                        <input
                          type="text"
                          id="player03"
                          placeholder="Player 03"
                          value={players.player03}
                          onChange={handleOnChange}
                          onBlur={handleOnBlur}
                          className=" w-full text-black text-[16px] font-[500]  bg-white rounded-r-[3px] pl-[5px]
                          focus:outline-none
                          "
                        />
                      </div>
                      <div className="max-w-[150px] mx-auto  flex mt-[20px]">
                        <div className="player__icon text-[#37B6E9]">
                          <svg
                            width="32px"
                            height="32px"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-[8px]"
                          >
                            <path
                              d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>

                        <input
                          type="text"
                          id="player04"
                          placeholder="Player 04"
                          value={players.player04}
                          onChange={handleOnChange}
                          onBlur={handleOnBlur}
                          className=" w-full text-black text-[16px] font-[500]  bg-white rounded-r-[3px] pl-[5px]
                          focus:outline-none
                          "
                        />
                      </div>
                    </div>
                  </div>
                  {/* --- Game Type --- */}
                  <div className="max-w-[350px] w-[350px] mt-[36px]">
                    <div className=" text-white font-[600] text-[16px] relative z-10">
                      Game Type :
                    </div>
                    <div className="game-rule__input-zone h-[44px] mt-[10px] grid-cols-2 grid gap-0 text-white font-[500] text-[12px] relative">
                      <input
                        type="radio"
                        id="singles"
                        name="type"
                        value={"singles"}
                        className="hidden"
                        checked={gameRule.type === "singles"}
                        onChange={handleOnChangeSetting}
                      />

                      <label
                        htmlFor="singles"
                        className="col-span-1  flex justify-center items-center opacity-70"
                      >
                        Single
                      </label>
                      <input
                        type="radio"
                        id="doubles"
                        name="type"
                        value={"doubles"}
                        className="hidden"
                        checked={gameRule.type === "doubles"}
                        onChange={handleOnChangeSetting}
                      />
                      <label
                        htmlFor="doubles"
                        className="col-span-1 flex justify-center items-center"
                      >
                        Doubles
                      </label>
                      <div className="game-rule__input--decor ">
                        <svg
                          className="absolute z-0
                        top-1/2 -translate-y-1/2

                        left-[-20px]
                        "
                          width="225"
                          height="145"
                          viewBox="0 0 225 145"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_dd_102_267)">
                            <rect
                              x="20"
                              y="50"
                              width="175"
                              height="45"
                              rx="10"
                              fill="url(#paint0_linear_102_267)"
                              shape-rendering="crispEdges"
                            />
                            <rect
                              x="20.5"
                              y="50.5"
                              width="174"
                              height="44"
                              rx="9.5"
                              stroke="url(#paint1_linear_102_267)"
                              stroke-opacity="0.2"
                              shape-rendering="crispEdges"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_dd_102_267"
                              x="-10"
                              y="0"
                              width="235"
                              height="145"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.0640972 0 0 0 0 0.0794837 0 0 0 0 0.108333 0 0 0 1 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_102_267"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="-20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.167014 0 0 0 0 0.203125 0 0 0 0 0.270833 0 0 0 0.5 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="effect1_dropShadow_102_267"
                                result="effect2_dropShadow_102_267"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect2_dropShadow_102_267"
                                result="shape"
                              />
                            </filter>
                            <linearGradient
                              id="paint0_linear_102_267"
                              x1="83.1061"
                              y1="61.9502"
                              x2="84.3831"
                              y2="90.0714"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#353F54" />
                              <stop offset="1" stop-color="#222834" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_102_267"
                              x1="39.6212"
                              y1="51.6805"
                              x2="52.5613"
                              y2="100.963"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="white" />
                              <stop offset="0.844522" />
                              <stop offset="1" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* --- Score Win By --- */}
                  <div className="max-w-[350px] w-[350px] mt-[36px]">
                    <div className=" text-white font-[600] text-[16px] relative z-10">
                      Match Score Win By :
                    </div>
                    <div className="game-rule__input-zone h-[44px] mt-[10px] grid-cols-2 grid gap-0 text-white font-[500] text-[12px] relative">
                      <input
                        type="radio"
                        id="winBy1"
                        name="winBy"
                        value={1}
                        className="hidden"
                        checked={gameRule.winBy === 1}
                        onChange={handleOnChangeSetting}
                      />

                      <label
                        htmlFor="winBy1"
                        className="col-span-1  flex justify-center items-center opacity-70"
                      >
                        1 Point
                      </label>
                      <input
                        type="radio"
                        id="winBy2"
                        name="winBy"
                        value={2}
                        className="hidden"
                        checked={gameRule.winBy === 2}
                        onChange={handleOnChangeSetting}
                      />
                      <label
                        htmlFor="winBy2"
                        className="col-span-1 flex justify-center items-center"
                      >
                        2 Points
                      </label>
                      <div className="game-rule__input--decor ">
                        <svg
                          className="absolute z-0
                        top-1/2 -translate-y-1/2

                        left-[-20px]
                        "
                          width="225"
                          height="145"
                          viewBox="0 0 225 145"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_dd_102_267)">
                            <rect
                              x="20"
                              y="50"
                              width="175"
                              height="45"
                              rx="10"
                              fill="url(#paint0_linear_102_267)"
                              shape-rendering="crispEdges"
                            />
                            <rect
                              x="20.5"
                              y="50.5"
                              width="174"
                              height="44"
                              rx="9.5"
                              stroke="url(#paint1_linear_102_267)"
                              stroke-opacity="0.2"
                              shape-rendering="crispEdges"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_dd_102_267"
                              x="-10"
                              y="0"
                              width="235"
                              height="145"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.0640972 0 0 0 0 0.0794837 0 0 0 0 0.108333 0 0 0 1 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_102_267"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="-20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.167014 0 0 0 0 0.203125 0 0 0 0 0.270833 0 0 0 0.5 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="effect1_dropShadow_102_267"
                                result="effect2_dropShadow_102_267"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect2_dropShadow_102_267"
                                result="shape"
                              />
                            </filter>
                            <linearGradient
                              id="paint0_linear_102_267"
                              x1="83.1061"
                              y1="61.9502"
                              x2="84.3831"
                              y2="90.0714"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#353F54" />
                              <stop offset="1" stop-color="#222834" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_102_267"
                              x1="39.6212"
                              y1="51.6805"
                              x2="52.5613"
                              y2="100.963"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="white" />
                              <stop offset="0.844522" />
                              <stop offset="1" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* --- Game Winning Score --- */}
                  <div className="max-w-[350px] w-[350px] mt-[36px]">
                    <div className=" text-white font-[600] text-[16px] relative z-10">
                      Game Winning Score :
                    </div>
                    <div className="game-rule__input-zone h-[44px] mt-[10px] grid-cols-3 grid gap-0 text-white font-[500] text-[12px] relative">
                      <input
                        type="radio"
                        id="targetScore11"
                        name="targetScore"
                        value={11}
                        checked={gameRule.targetScore === 11}
                        onChange={handleOnChangeSetting}
                        className="hidden"
                      />

                      <label
                        htmlFor="targetScore11"
                        className="col-span-1  flex justify-center items-center opacity-70"
                      >
                        11 Points
                      </label>
                      <input
                        type="radio"
                        id="targetScore15"
                        name="targetScore"
                        value={15}
                        checked={gameRule.targetScore === 15}
                        onChange={handleOnChangeSetting}
                        className="hidden"
                      />
                      <label
                        htmlFor="targetScore15"
                        className="col-span-1 flex justify-center items-center"
                      >
                        15 Points
                      </label>
                      <input
                        type="radio"
                        id="targetScore21"
                        name="targetScore"
                        value={21}
                        className="hidden"
                        checked={gameRule.targetScore === 21}
                        onChange={handleOnChangeSetting}
                      />
                      <label
                        htmlFor="targetScore21"
                        className="col-span-1 flex justify-center items-center"
                      >
                        21 Points
                      </label>
                      <div className="game-rule__input--decor input-decor-3 ">
                        <svg
                          className="absolute z-0
                        top-1/2 -translate-y-1/2

                        left-[-30px]
                        "
                          width="178"
                          height="145"
                          viewBox="0 0 178 145"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_dd_102_290)">
                            <rect
                              x="30"
                              y="50"
                              width="118"
                              height="45"
                              rx="10"
                              fill="url(#paint0_linear_102_290)"
                              shape-rendering="crispEdges"
                            />
                            <rect
                              x="30.5"
                              y="50.5"
                              width="117"
                              height="44"
                              rx="9.5"
                              stroke="url(#paint1_linear_102_290)"
                              stroke-opacity="0.2"
                              shape-rendering="crispEdges"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_dd_102_290"
                              x="0"
                              y="0"
                              width="178"
                              height="145"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.0640972 0 0 0 0 0.0794837 0 0 0 0 0.108333 0 0 0 1 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_102_290"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="-20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.167014 0 0 0 0 0.203125 0 0 0 0 0.270833 0 0 0 0.5 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="effect1_dropShadow_102_290"
                                result="effect2_dropShadow_102_290"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect2_dropShadow_102_290"
                                result="shape"
                              />
                            </filter>
                            <linearGradient
                              id="paint0_linear_102_290"
                              x1="72.5515"
                              y1="61.9502"
                              x2="74.4408"
                              y2="90.0022"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#353F54" />
                              <stop offset="1" stop-color="#222834" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_102_290"
                              x1="43.2303"
                              y1="51.6805"
                              x2="61.0431"
                              y2="97.4243"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="white" />
                              <stop offset="0.844522" />
                              <stop offset="1" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* --- Match Total Game --- */}
                  <div className="max-w-[350px] w-[350px] mt-[36px]">
                    <div className=" text-white font-[600] text-[16px] relative z-10">
                      Match Total Game :
                    </div>
                    <div className="game-rule__input-zone h-[44px] mt-[10px] grid-cols-3 grid gap-0 text-white font-[500] text-[12px] relative">
                      <input
                        type="radio"
                        id="totalGames1"
                        name="totalGames"
                        value={1}
                        className="hidden"
                        checked={gameRule.totalGames === 1}
                        onChange={handleOnChangeSetting}
                      />

                      <label
                        htmlFor="totalGames1"
                        className="col-span-1  flex justify-center items-center opacity-70"
                      >
                        1 Game
                      </label>
                      <input
                        type="radio"
                        id="totalGames3"
                        name="totalGames"
                        value={3}
                        className="hidden"
                        checked={gameRule.totalGames === 3}
                        onChange={handleOnChangeSetting}
                      />
                      <label
                        htmlFor="totalGames3"
                        className="col-span-1 flex justify-center items-center"
                      >
                        Best of 3
                      </label>
                      <input
                        type="radio"
                        id="totalGames5"
                        name="totalGames"
                        value={5}
                        className="hidden"
                        checked={gameRule.totalGames === 5}
                        onChange={handleOnChangeSetting}
                      />
                      <label
                        htmlFor="totalGames5"
                        className="col-span-1 flex justify-center items-center"
                      >
                        Best of 5
                      </label>
                      <div className="game-rule__input--decor input-decor-3 ">
                        <svg
                          className="absolute z-0
                        top-1/2 -translate-y-1/2

                        left-[-30px]
                        "
                          width="178"
                          height="145"
                          viewBox="0 0 178 145"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_dd_102_290)">
                            <rect
                              x="30"
                              y="50"
                              width="118"
                              height="45"
                              rx="10"
                              fill="url(#paint0_linear_102_290)"
                              shape-rendering="crispEdges"
                            />
                            <rect
                              x="30.5"
                              y="50.5"
                              width="117"
                              height="44"
                              rx="9.5"
                              stroke="url(#paint1_linear_102_290)"
                              stroke-opacity="0.2"
                              shape-rendering="crispEdges"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_dd_102_290"
                              x="0"
                              y="0"
                              width="178"
                              height="145"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.0640972 0 0 0 0 0.0794837 0 0 0 0 0.108333 0 0 0 1 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_102_290"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="-20" />
                              <feGaussianBlur stdDeviation="15" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0.167014 0 0 0 0 0.203125 0 0 0 0 0.270833 0 0 0 0.5 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="effect1_dropShadow_102_290"
                                result="effect2_dropShadow_102_290"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect2_dropShadow_102_290"
                                result="shape"
                              />
                            </filter>
                            <linearGradient
                              id="paint0_linear_102_290"
                              x1="72.5515"
                              y1="61.9502"
                              x2="74.4408"
                              y2="90.0022"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#353F54" />
                              <stop offset="1" stop-color="#222834" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_102_290"
                              x1="43.2303"
                              y1="51.6805"
                              x2="61.0431"
                              y2="97.4243"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="white" />
                              <stop offset="0.844522" />
                              <stop offset="1" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* ---- Create New Game--- */}
                  <div className="w-full flex justify-center my-[48px]">
                    <button
                      className="w-[160px] h-[44px]
                        text-[15px] font-[600] text-[#ffffff]/80 hover:text-white
                        pk-bg-linear-blue rounded-[10px]
                        "
                      onClick={newGame}
                    >
                      {" "}
                      New game
                    </button>
                  </div>
                </div>
              </div>
              <div className="md-setting__form--stroke rounded-t-[20px]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
