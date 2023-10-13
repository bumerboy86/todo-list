import { DragEvent, useEffect, useState } from "react";
import "./App.css";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useEditNoteMutation,
  useGetNotesQuery,
} from "./store/controllers/noteApi.ts";
import { toast } from "react-toastify";
import { INote } from "./interfaces/INote.ts";
import { INoteParams } from "./interfaces/INoteParams.ts";

function App() {
  const [block, setBlock] = useState(false);
  const [
    addNote,
    { isSuccess: addSuccess, data: AddDataNote, isLoading, isError },
  ] = useAddNoteMutation();
  const [changeNote] = useEditNoteMutation();
  const [delNote, { isSuccess: delSuccess }] = useDeleteNoteMutation();
  const { data: getDataNotes } = useGetNotesQuery();
  const [message, setMessage] = useState("");
  const [todoItem, setTodoItem] = useState({ id: "", index: 0, message: "" });

  useEffect(() => {
    isLoading && setBlock(true);
    addSuccess && setBlock(false);
    isError && setBlock(false);
  }, [isLoading, addSuccess, isError]);

  const findMaxIndex = (data: INote) => {
    const result = Object.keys(data).reduce(
      (max, item) => (data[item].index > max ? data[item].index : max),
      -Infinity
    );
    return result + 1;
  };

  const addTodoHandler = async () => {
    if (message.trim()) {
      const newIndex = getDataNotes ? findMaxIndex(getDataNotes) : 1;
      await addNote({ message, index: newIndex });
    } else {
      toast.info("Напишите задачу");
    }
  };

  const deleteNoteHandler = async (data: string) => {
    await delNote(data);
  };

  useEffect(() => {
    if (addSuccess && AddDataNote) {
      toast.success("Задача добавлена");
      setMessage("");
    }
  }, [addSuccess, AddDataNote]);

  useEffect(() => {
    delSuccess && toast.success("Задача удалена");
  }, [delSuccess]);

  function onDragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    if (e.currentTarget.className === "todo_item") {
      e.currentTarget.style.boxShadow = "0 0 15px gold";
    }
  }

  function onDragLeaveHandler(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
  }

  function onDragStartHandler(item: INoteParams): void {
    setTodoItem(item);
  }

  function onDragEndHandler(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
  }

  const changeNotes = async (note1: INoteParams, note2: INoteParams) => {
    await changeNote({
      id: note1.id,
      index: note2.index,
      message: note1.message,
    });
    await changeNote({
      id: note2.id,
      index: note1.index,
      message: note2.message,
    });
  };

  function onDropHandler(
    e: DragEvent<HTMLDivElement>,
    item: string,
    position: number,
    dropedMessage: string
  ): void {
    e.preventDefault();
    if (item !== todoItem.id) {
      changeNotes(
        { id: item, index: position, message: dropedMessage },
        {
          id: todoItem.id,
          index: todoItem.index,
          message: todoItem.message,
        }
      );
    }
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <div className='todo_body'>
      <h1>Список задач</h1>
      <section className='todo_input_section'>
        <input
          value={message}
          className='toto_text_input'
          type='text'
          placeholder='Введите заметку'
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className='add_btn' onClick={addTodoHandler} disabled={block}>
          Добавить
        </button>
      </section>
      <div className='todo_list'>
        {getDataNotes &&
          Object.keys(getDataNotes)
            .sort((a, b) => getDataNotes[a].index - getDataNotes[b].index)
            .map((item, i) => {
              return (
                <div
                  key={item}
                  className='todo_item'
                  draggable={true}
                  onDragOver={(e) => onDragOverHandler(e)}
                  onDragLeave={(e) => onDragLeaveHandler(e)}
                  onDragStart={() =>
                    onDragStartHandler({
                      id: item,
                      index: getDataNotes[item].index,
                      message: getDataNotes[item].message,
                    })
                  }
                  onDragEnd={(e) => onDragEndHandler(e)}
                  onDrop={(e) =>
                    onDropHandler(
                      e,
                      item,
                      getDataNotes[item].index,
                      getDataNotes[item].message
                    )
                  }
                >
                  <p className='todo_index'>{i + 1}</p>
                  <p className='todo_text'>{getDataNotes[item].message}</p>
                  <button
                    className='delete_btn'
                    onClick={() => deleteNoteHandler(item)}
                  >
                    x
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default App;
