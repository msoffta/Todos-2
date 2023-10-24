import { useEffect, useState } from "react";
import { Modal } from "react-overlays";

function Todos({ update, type, query, setUpdate }) {
  const [Todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const base_url = "http://localhost:8080";

  useEffect(() => {
    getTodos();
  }, [update]);

  async function getTodos() {
    const response = await fetch(`${base_url}/todos`);
    const data = await response.json();
    setTodos(data);
  }

  function handleClose() {
    setShowModal(false);
  }

  function loadChange(todo) {
    setCurrentUser(todo);
    setShowModal(true);
  }

  async function deleteTodo(event) {
    event.preventDefault();

    let response = await fetch(`${base_url}/todos/${currentUser.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setUpdate(update + 1);
      setShowModal(false);
    } else {
      alert("Что-то пошло не так");
    }
  }

  async function changeTodo(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const todo = {
      title: data.get("title"),
      description: data.get("description"),
      date: data.get("date"),
      time: data.get("time"),
      done: data.get("select"),
    };

    let response = await fetch(`${base_url}/todos/${currentUser.id}`, {
      method: "PUT",
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
  }

  if (type === "Таблица") {
    let todos = Todos.map((todo) => {
      if (query === "") {
        return (
          <tr
            onDoubleClick={() => loadChange(todo)}
            data-id={todo.id}
            key={todo.id}
          >
            <td data-title className="w-[20%]">
              {todo.title}
            </td>
            <td data-description className="w-[40%]">
              {todo.description}
            </td>
            <td data-date className="w-[5%]">
              {todo.date}
            </td>
            <td data-time className="w-[5%]">
              {todo.time}
            </td>
            <td
              data-done
              style={{
                color:
                  todo.done === "Не выполнено"
                    ? "#FF3F3F"
                    : todo.done === "В прогрессе"
                    ? "#007FFF"
                    : "#000000",
              }}
              className="w-[20%]"
            >
              {todo.done}
            </td>
          </tr>
        );
      } else if (
        todo.title.toLowerCase().includes(query.toLowerCase()) ||
        todo.description.toLowerCase().includes(query.toLowerCase()) ||
        todo.date.toLowerCase().includes(query.toLowerCase()) ||
        todo.time.toLowerCase().includes(query.toLowerCase()) ||
        todo.done.toLowerCase().includes(query.toLowerCase())
      ) {
        return (
          <tr
            onDoubleClick={() => loadChange(todo)}
            data-id={todo.id}
            key={todo.id}
          >
            <td data-title className="w-[20%]">
              {todo.title}
            </td>
            <td data-description className="w-[40%]">
              {todo.description}
            </td>
            <td data-date className="w-[5%]">
              {todo.date}
            </td>
            <td data-time className="w-[5%]">
              {todo.time}
            </td>
            <td
              data-done
              style={{
                color:
                  todo.done === "Не выполнено"
                    ? "#FF3F3F"
                    : todo.done === "В прогрессе"
                    ? "#007FFF"
                    : "#000000",
              }}
              className="w-[20%]"
            >
              {todo.done}
            </td>
          </tr>
        );
      }
    });

    return (
      <>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-[20%]">Заголовок задачи</th>
              <th className="w-[50%]">Описание задачи</th>
              <th className="w-[10%]">Дата</th>
              <th className="w-[10%]">Время</th>
              <th className="w-[10%]">Выполнено</th>
            </tr>
          </thead>

          <tbody>{todos}</tbody>
        </table>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:outline-none"
          renderBackdrop={(props) => (
            <div
              className="absolute inset-0 bg-[rgba(0,0,0,0.35)]"
              {...props}
            />
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

            <h2 className="font-[Gilroy] font-[600] text-[38px]">Изменить</h2>
            <form
              onSubmit={(event) => changeTodo(event)}
              className="flex flex-col justify-center items-center mt-8 gap-2"
            >
              <input
                type="text"
                className="placeholder:font-[Gilroy] placeholder:font-semibold placeholder:text-black font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Заголовок"
                name="title"
                defaultValue={currentUser.title}
                required
              />
              <input
                type="text"
                className="placeholder:font-[Gilroy] placeholder:font-semibold placeholder:text-black font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Описание"
                name="description"
                defaultValue={currentUser.description}
                required
              />
              <input
                type="time"
                className=" font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Время"
                name="time"
                defaultValue={currentUser.time}
              />

              <input
                type="date"
                className="appearance-none font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Время (дата)"
                name="date"
                defaultValue={currentUser.date}
              />

              <select
                name="select"
                id="select"
                className="appearance-none font-[Gilroy] font-[600] pl-4 pr-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                defaultValue={currentUser.done}
              >
                <option
                  className="font-[Gilroy] font-[500]"
                  value="Не выполнено"
                >
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

              <button
                className="w-full h-12 bg rounded-xl bg-[#0047FF] text-white font-semibold font-[Gilroy]"
                type="submit"
              >
                Добавить
              </button>

              <button
                onClick={(event) => {
                  deleteTodo(event);
                }}
                className="w-full h-12 rounded-xl bg-[#E70000] text-white font-semibold font-[Gilroy]"
                type="button"
              >
                Удалить
              </button>
            </form>
          </div>
        </Modal>
      </>
    );
  } else {
    let todos = Todos.map((todo) => {
      if (query == "") {
        return (
          <div
            className="flex flex-col p-6 items-start justify-center rounded-[10px] bg-white shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] transition duration-500 ease"
            data-id={todo.id}
            onDoubleClick={() => loadChange(todo)}
            key={todo.id}
          >
            <h2 data-title className="text-[20px] font-[600] mb-3">
              {todo.title}
            </h2>
            <p
              className="text-[#A5A5B4] text-[14px] font-[600]"
              data-description
            >
              {todo.description}
            </p>

            <div className="flex items-center justify-center mt-4 gap-3 text-14px font-[600]">
              <div data-date className="text-[14px]">
                {todo.date}
              </div>
              <div data-time className="text-[14px]">
                {todo.time}
              </div>
            </div>
            <div
              data-done
              style={{
                color:
                  todo.done === "Не выполнено"
                    ? "#FF3F3F"
                    : todo.done === "В прогрессе"
                    ? "#007FFF"
                    : "#000000",
              }}
              className="mt-4 text-[14px] font-[600]"
            >
              {todo.done}
            </div>
          </div>
        );
      } else if (
        todo.title.toLowerCase().includes(query.toLowerCase()) ||
        todo.description.toLowerCase().includes(query.toLowerCase()) ||
        todo.date.toLowerCase().includes(query.toLowerCase()) ||
        todo.time.toLowerCase().includes(query.toLowerCase()) ||
        todo.done.toLowerCase().includes(query.toLowerCase())
      ) {
        return (
          <div
            className="flex flex-col p-6 items-start justify-center rounded-[10px] bg-white shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)_0px_8px_16px_-8px] transition duration-500 ease"
            data-id={todo.id}
            key={todo.id}
            onDoubleClick={() => loadChange(todo)}
          >
            <h2 data-title className="text-[20px] font-[600] mb-3">
              {todo.title}
            </h2>
            <p
              className="text-[#A5A5B4] text-[14px] font-[600]"
              data-description
            >
              {todo.description}
            </p>

            <div className="flex items-center justify-center mt-4 gap-3 text-14px font-[600]">
              <div data-date className="text-[14px]">
                {todo.date}
              </div>
              <div data-time className="text-[14px]">
                {todo.time}
              </div>
            </div>
            <div
              data-done
              style={{
                color:
                  todo.done === "Не выполнено"
                    ? "#FF3F3F"
                    : todo.done === "В прогрессе"
                    ? "#007FFF"
                    : "#000000",
              }}
              className="mt-4 text-[14px] font-[600]"
            >
              {todo.done}
            </div>
          </div>
        );
      }
    });

    return (
      <>
        <div className="grid grid-cols-3 gap-6 items-center justify-center">
          {todos}
        </div>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:outline-none"
          renderBackdrop={(props) => (
            <div
              className="absolute inset-0 bg-[rgba(0,0,0,0.35)]"
              {...props}
            />
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

            <h2 className="font-[Gilroy] font-[600] text-[38px]">Изменить</h2>
            <form
              onSubmit={(event) => changeTodo(event)}
              className="flex flex-col justify-center items-center mt-8 gap-2"
            >
              <input
                type="text"
                className="placeholder:font-[Gilroy] placeholder:font-semibold placeholder:text-black font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Заголовок"
                name="title"
                defaultValue={currentUser.title}
                required
              />
              <input
                type="text"
                className="placeholder:font-[Gilroy] placeholder:font-semibold placeholder:text-black font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Описание"
                name="description"
                defaultValue={currentUser.description}
                required
              />
              <input
                type="time"
                className=" font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Время"
                name="time"
                defaultValue={currentUser.time}
              />

              <input
                type="date"
                className="appearance-none font-[Gilroy] font-[600] pl-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                placeholder="Время (дата)"
                name="date"
                defaultValue={currentUser.date}
              />

              <select
                name="select"
                id="select"
                className="appearance-none font-[Gilroy] font-[600] pl-4 pr-4 w-[438px] h-12 rounded-xl border-solid border-[1px] border-black focus:outline-none"
                defaultValue={currentUser.done}
              >
                <option
                  className="font-[Gilroy] font-[500]"
                  value="Не выполнено"
                >
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

              <button
                className="w-full h-12 bg rounded-xl bg-[#0047FF] text-white font-semibold font-[Gilroy]"
                type="submit"
              >
                Добавить
              </button>

              <button
                onClick={(event) => {
                  deleteTodo(event);
                }}
                className="w-full h-12 rounded-xl bg-[#E70000] text-white font-semibold font-[Gilroy]"
                type="button"
              >
                Удалить
              </button>
            </form>
          </div>
        </Modal>
      </>
    );
  }
}

export default Todos;
