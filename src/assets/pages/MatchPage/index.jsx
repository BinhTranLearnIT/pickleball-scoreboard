import React, { useEffect, useState } from "react";

export default function MatchPage() {
  const [gameState, setGameState] = useState({
    mode: "doubles", // chế độ chơi ("single" or "doubles")
    score: [0, 0], // điểm đội 1 và đội 2
    server: 0, // đội đang giao bóng (0 hoặc 1)
    serverIndex: 2, // người giao: 1 hoặc 2 (chỉ dùng cho đôi)
    servingSide: "right", // bên sân giao (dựa vào điểm chẵn/lẻ)
    history: [], // để undo, nếu cần
  });
  const [players, setPlayers] = useState({
    player01: "",
    player02: "",
    player03: "",
    player04: "",
  });
  const [gameRule, setGameRule] = useState({
    type: "doubles",
    winBy: 2,
    totalGames: 3,
    targetScore: 11,
  });
  //   useEffect(() => {
  //     // setHistory
  //     setGameState((prev) => {
  //       const newState = { ...prev, history: [...prev.history, { ...prev }] };

  //       return newState;
  //     });
  //   }, []);

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

  const [winMessage, setWinMessage] = useState("");
  const [showModalWinner, setShowModalWinner] = useState(false);

  function showAlert(winner) {
    setWinMessage(`${winner} wins the match! 🏆`);
    setShowModalWinner(true);
  }
  return (
    <div className="min-h-[100dvh]  w-screen bg-[#242c3b] ">
      <div className="container mx-auto">
        {/* <div className="h-[844px] w-[390px] bg-[#242c3b]  relative mx-auto "> */}
        <div className="match__setting w-full pt-[20px] text-right">
          <button className="text-white mr-[20px]">
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
                <div className="zone-1 col-span-4 h-[100px] bg-[#4183EB]">
                  {gameState.server == 0 &&
                    gameState.servingSide === "left" && (
                      <div className="w-full h-full bg-[#3812C3] flex justify-center items-start animate-fade-in">
                        <div className="my-[10px] text-[16px] text-white font-[500]">
                          {
                            <div className="w-full h-full bg-[#3812C3] flex justify-center items-start">
                              <div className="my-[10px] text-[16px] text-white font-[500] capitalize">
                                {showPlayer()}
                              </div>
                            </div>
                          }
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
                        <div className="my-[10px] text-[16px] text-white font-[500]">
                          {
                            <div className="w-full h-full bg-[#3812C3] flex justify-center items-start">
                              <div className="my-[10px] text-[16px] text-white font-[500] capitalize">
                                {showPlayer()}
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    )}
                </div>
                <div className="zone-2 col-span-4 h-[100px] bg-[#4183EB]">
                  {gameState.server == 0 &&
                    gameState.servingSide === "right" && (
                      <div className="w-full h-full bg-[#3812C3] flex justify-center items-end">
                        <div className="my-[10px] text-[16px] text-white font-[500] capitalize">
                          {showPlayer()}
                        </div>
                      </div>
                    )}
                </div>
                <div className="kitchen-1 col-span-1 h-[100px] bg-[#6EE876]"></div>
                <div className="kitchen-4 col-span-1 h-[100px] bg-[#6EE876]"></div>
                <div className="zone-3 col-span-4 h-[100px] bg-[#4183EB]">
                  {gameState.server == 1 &&
                    gameState.servingSide === "left" && (
                      <div className="w-full h-full bg-[#3812C3] flex justify-center items-end">
                        <div className="my-[10px] text-[16px] text-white font-[500] capitalize">
                          {showPlayer()}
                        </div>
                      </div>
                    )}
                </div>
                <div className="arrow w-full h-full absolute top-0 left-0 flex justify-center items-center animate-fade-in">
                  {showArrow()}
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
          <div className="flex justify-center space-x-[36px] mt-[38px]">
            <button
              className={` w-[160px] py-[10px]
            rounded-[10px] text-[15px] font-[600] text-white
            pk-bg-linear-blue 
            ${gameState.history.length === 0 ? "opacity-50" : "opacity-100"}
            `}
              onClick={undo}
            >
              UNDO
            </button>
            <button
              className=" w-[160px] py-[10px]
            rounded-[10px] text-[15px] font-[600] text-white
            pk-bg-linear-blue 
            "
              onClick={() => nextPlayer()}
            >
              Next Server
            </button>
          </div>
        </div>
        <div
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
        </div>
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
    </div>
  );
}
