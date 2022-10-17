import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Label } from '~/components/Label';

import type { Notice, Acknowledgment } from '~/types';
import { getAcknowledgments, getNotice, updateNotice } from '~/firebase.server';
import { Input } from '~/components/form';
import { Button } from '~/components/Button';

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.noticeId as string;

  const [notice, acknowledgments] = await Promise.all([
    getNotice(id),
    getAcknowledgments(id),
  ]);

  if (!notice) {
    throw new Response('Notice not found', { status: 404 });
  }

  return json({
    notice,
    acknowledgments,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const id = form.get('id') as string;
  const data = {
    title: form.get('title'),
    description: form.get('description'),
    link: form.get('link'),
    allowList: form.get('allowList')
      ? (form.get('allowList') as string).split(',')
      : [],
  };

  // TODO: validate form fields

  await updateNotice(id, data);
  return redirect(`/notices/${id}`);
};

type LoaderData = {
  notice: Notice;
  acknowledgments: Acknowledgment[];
};

export default function NoticePage() {
  const { notice, acknowledgments } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <a href="/">&larr; Back</a>
      </div>
      <h2 className="text-xl font-bold">Manage Notice ({notice.id})</h2>
      <form method="post" action={`/notices/${notice.id}`}>
        <input type="hidden" name="id" value={notice.id} />
        <Label
          label="Notice Type *"
          description="A required type for the notice. This is used to identify the notice and is used to determine which users have acknowledged the notice. Use an existing type to create a new instance of a notice."
        >
          <Input name="type" type="text" value={notice.type} disabled />
        </Label>
        <Label
          label="Notice Version"
          description="An optional notice version. This can be used to filter a specific notice versions via the `getNotice` callable function."
        >
          <Input name="version" type="number" value={notice.version} disabled />
        </Label>
        <Label
          label="Notice Title"
          description="An optional title to provide to the notice. Applications may use this to outline the notice intent."
        >
          <Input name="title" type="text" defaultValue={notice.title || ''} />
        </Label>
        <Label
          label="Notice Description"
          description="An optional description to provide to the notice. Applications may use this to show detailed information about the notice."
        >
          <textarea
            name="description"
            defaultValue={notice.description || ''}
          ></textarea>
        </Label>
        <Label
          label="Notice Link"
          description="An optional URL to provide to the notice. Applications may use this to redirect users to another page / external resource for further information."
        >
          <Input name="link" type="text" defaultValue={notice.link || ''} />
        </Label>
        <Label
          label="Allow List"
          description="An optional command separated list of user IDs. If provided, only users with IDs in the list will be able to acknowledge the notice."
        >
          <Input
            name="allowList"
            type="text"
            defaultValue={
              Array.isArray(notice.allowList) ? notice.allowList.join(',') : ''
            }
          />
        </Label>
        <div className="mt-6 flex justify-end">
          <Button type="submit">Update Notice &rarr;</Button>
        </div>
      </form>
      <hr className="my-6" />
      <h2 className="text-xl font-bold mb-4">Notice Acknowledgments</h2>
      <table className="w-full table-auto border border-spacing-0.5">
        <thead>
          <tr className="text-left [&>th]:p-4 bg-slate-100">
            <th>ID</th>
            <th>Event Type</th>
            <th>User ID</th>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Metadata</th>
          </tr>
        </thead>
        <tbody>
          {acknowledgments.map(acknowledgment => (
            <tr
              key={acknowledgment.id}
              className="border-t [&>td]:p-3 [&>.code]:font-mono"
            >
              <td>{acknowledgment.id}</td>
              <td>{acknowledgment.ackEvent}</td>
              <td>{acknowledgment.userId}</td>
              <td>{acknowledgment.createdAt._seconds}</td>
              <td>
                {acknowledgment.ackEvent === 'acknowledged'
                  ? acknowledgment.type
                  : 'N/A'}
              </td>
              <td>{JSON.stringify(acknowledgment.metadata || {})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
