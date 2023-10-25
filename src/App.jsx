import { useEffect, useState } from "react";
import Todos from "./table";
import { Modal } from "react-overlays";

function App() {
  const [viewMode, setViewMode] = useState("Таблица");
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(0);
  const [timeUpdate, setTimeUpdate] = useState(false);
  const [interval, setIntervalId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const base_url = "http://localhost:8080";

  useEffect(() => {
    console.log(timeUpdate);
    if (timeUpdate) {
      setIntervalId(
        setInterval(() => {
          document.querySelector("input[name='time']").value = getTime();
        }, 1000)
      );
    } else {
      clearInterval(interval);
      setIntervalId(null);
    }
  }, [timeUpdate]);

  function getTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let formattedHours = hours < 10 ? `0${hours}` : hours;
    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let currentTime = `${formattedHours}:${formattedMinutes}`;
    return currentTime;
  }

  function handleClose() {
    setTimeUpdate(false);
    setShowModal(false);
  }

  async function addTodo(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const todo = {
      title: data.get("title"),
      description: data.get("description"),
      date: data.get("date"),
      time: data.get("time"),
      done: data.get("select"),
    };

    let response = await fetch(`${base_url}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    if (response.ok) {
      setUpdate(update + 1);
    } else {
      alert("Что-то пошло не так");
    }

    handleClose();
  }

  function changeViewMode(event) {
    document.querySelectorAll("div[name='view-mode'] span").forEach((el) => {
      el.classList.remove("active");
    });

    event.target.classList.add("active");
    setViewMode(event.target.innerText);
  }

  return (
    <>
      <div className="w-[80%] m-auto pt-[30px]">
        <div className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-10">
            <h1 className="font-[Gilroy] font-[700] text-[38px]">Dashboard</h1>

            <button
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
              className="w-[183px] h-[46px] bg-[#007FFF] rounded-[10px] text-white font-[Gilroy] font-[600]"
            >
              Добавить задачу
            </button>
          </div>

          <form name="search">
            <label
              className="w-[250px] h-[46px] flex justify-between items-center border-[1px] border-solid border-[rgb(0,0,0,0.3)] rounded-[10px] pl-[25px]"
              htmlFor="search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                id="search"
                name="search"
                type="text"
                placeholder="Поиск по задачам"
                className="text-[16px] font-[Gilroy] font-[600] bg-transparent focus:outline-none"
                onInput={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </form>
        </div>

        <div className="mt-[20px]">
          <div className="font-[Gilroy] font-[600] flex items-center justify-start gap-4">
            Показать задачи как:
            <div
              name="view-mode"
              className="flex items-center justify-center gap-2"
            >
              <span
                className="cursor-pointer active"
                onClick={(e) => changeViewMode(e)}
              >
                Таблица
              </span>
              <span
                className="cursor-pointer"
                onClick={(e) => changeViewMode(e)}
              >
                Плитка
              </span>
            </div>
          </div>
        </div>

        <div className="mt-[50px]">
          <Todos
            setUpdate={setUpdate}
            query={searchQuery}
            update={update}
            type={viewMode}
          ></Todos>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:outline-none"
        renderBackdrop={(props) => (
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)]" {...props} />
        )}
        onBackdropClick={() => handleClose()}
      >
        <div className="bg-white p-16 rounded-xl">
          <button
            className="material-symbols-outlined absolute top-8 right-8"
            onClick={handleClose}
            type="button"
          >
            close
          </button>

          <h2 className="font-[Gilroy] font-[600] text-[38px]">Добавить</h2>
          <form
            onSubmit={(event) => addTodo(event)}
            className="flex flex-col justify-center items-center mt-8 gap-2"
          >
            <input
              type="text"
              className="placeholder:font-[Gilroy] placeholder:font-semibold placeholder:text-black font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
              placeholder="Заголовок"
              name="title"
              required
            />
            <input
              type="text"
              className="placeholder:font-[Gilroy] placeholder:font-semibold placeholder:text-black font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
              placeholder="Описание"
              name="description"
              required
            />
            <input
              type="time"
              className="font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
              placeholder="Время"
              name="time"
              defaultValue={getTime()}
            />

            <input
              type="date"
              className="font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
              placeholder="Время (дата)"
              name="date"
              defaultValue={new Date().toISOString().substring(0, 10)}
            />

            <select
              name="select"
              id="select"
              className="font-[Gilroy] font-[600] pl-4 pr-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
            >
              <option className="font-[Gilroy] font-[500]" value="Не выполнено">
                Не выполнено
              </option>
              <option
                className="w-5 font-[Gilroy] font-[500]"
                value="В прогрессе"
              >
                В прогрессе
              </option>
              <option className="font-[Gilroy] font-[500]" value="Готово">
                Готово
              </option>
            </select>

            <p className="flex items-center justify-center gap-2 mt-4 mb-4">
              <span>Auto Time</span>
              <label className="switch">
                <input onClick={(e) => {
                  setTimeUpdate(e.target.checked);
                }} type="checkbox" name="check" id="check" />
                <span className="slider round"></span>
              </label>
            </p>

            <button
              className="w-full h-12 bg rounded-xl bg-[#0047FF] text-white font-semibold font-[Gilroy]"
              type="submit"
            >
              Добавить
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default App;
