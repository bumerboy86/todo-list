import { DragEvent, useEffect, useState } from "react";
import "./App.css";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
} from "./store/controllers/noteApi.ts";
import { toast } from "react-toastify";
import { INote } from "./interfaces/INote.ts";

function App() {
  const [block, setBlock] = useState(false);
  const [
    addNote,
    { isSuccess: addSuccess, data: AddDataNote, isLoading, isError },
  ] = useAddNoteMutation();
  const [delNote, { isSuccess: delSuccess }] = useDeleteNoteMutation();
  const { data: getDataNotes } = useGetNotesQuery();
  const [message, setMessage] = useState("");

  useEffect(() => {
    isLoading && setBlock(true);
    addSuccess && setBlock(false);
    isError && setBlock(false);
  }, [isLoading, addSuccess, isError]);

  const findMaxIndex = (data: INote) =>
    Object.keys(data).reduce(
      (max, item) => (data[item].index > max ? data[item].index : max),
      -Infinity
    );

  const addTodoHandler = async () => {
    if (message.trim()) {
      const newIndex = getDataNotes ? findMaxIndex(getDataNotes) : 1;
      await addNote({ message, index: newIndex });
    } else {
      toast.info("Напишите заметку");
    }
  };

  const deleteNoteHandler = async (data: string) => {
    await delNote(data);
  };

  useEffect(() => {
    if (addSuccess && AddDataNote) {
      toast.success("заметка добавлена");
      setMessage("");
    }
  }, [addSuccess, AddDataNote]);

  useEffect(() => {
    delSuccess && toast.success("заметка удалена");
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

  // function onDragStartHandler(e: DragEvent<HTMLDivElement>, item: TTodo): void {
  //   setTodoItem(item);
  // }

  function onDragStartHandler(item: string): void {
    console.log(item);
    // setTodoItem(item);
  }

  function onDragEndHandler(e: DragEvent<HTMLDivElement>): void {
    e.currentTarget.style.boxShadow = "none";
  }

  // function onDropHandler(e: DragEvent<HTMLDivElement>, item: TTodo): void {
  //   e.preventDefault();
  //   setTodo((prev) =>
  //     [...prev].map((key) => {
  //       if (key.id === item.id && todoItem) {
  //         return { ...key, index: todoItem.index };
  //       }
  //       if (todoItem && key.id === todoItem.id) {
  //         return { ...key, index: item.index };
  //       }
  //       return key;
  //     })
  //   );
  //   e.currentTarget.style.boxShadow = "none";
  // }
  function onDropHandler(e: DragEvent<HTMLDivElement>, item: string): void {
    e.preventDefault();
    console.log(item);
    // setTodo((prev) =>
    //   [...prev].map((key) => {
    //     if (key.id === item.id && todoItem) {
    //       return { ...key, index: todoItem.index };
    //     }
    //     if (todoItem && key.id === todoItem.id) {
    //       return { ...key, index: item.index };
    //     }
    //     return key;
    //   })
    // );
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <div className='todo_body'>
      <h1>Todo-List</h1>
      <section className='todo_input_section'>
        <input
          value={message}
          className='toto_text_input'
          type='text'
          placeholder='Введите заметку'
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className='add_btn' onClick={addTodoHandler} disabled={block}>
          ADD
        </button>
      </section>
      <div className='todo_list'>
        {getDataNotes &&
          Object.keys(getDataNotes).map((item, i) => {
            return (
              <div
                key={item}
                className='todo_item'
                draggable={true}
                onDragOver={(e) => onDragOverHandler(e)}
                onDragLeave={(e) => onDragLeaveHandler(e)}
                onDragStart={() => onDragStartHandler(item)}
                onDragEnd={(e) => onDragEndHandler(e)}
                onDrop={(e) => onDropHandler(e, item)}
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
