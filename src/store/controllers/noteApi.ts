import { INote } from "../../interfaces/INote.ts";
import { INoteParams } from "../../interfaces/INoteParams.ts";
import { INotePre } from "../../interfaces/INotePre.ts";
import { IRespAddNote } from "../../interfaces/respAddNote.ts";
import { api } from "../api.ts";

export const noteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<INote | null, void>({
      query: () => "/notes.json",
      providesTags: ["Notes"],
    }),

    deleteNote: builder.mutation<string, string>({
      query: (id: string) => ({
        url: `/notes/${id}.json`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),

    addNote: builder.mutation<IRespAddNote, INotePre>({
      query: (body: INotePre) => ({
        url: `/notes.json`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),

    editNote: builder.mutation<INote, INoteParams>({
      query: (data: INoteParams) => {
        const { id, ...body } = data;
        return {
          url: `/notes/${id}.json`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useDeleteNoteMutation,
  useAddNoteMutation,
  useEditNoteMutation,
} = noteApi;
