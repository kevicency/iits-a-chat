import { useJazz } from 'jazz-react'
import { HashRoute } from 'hash-slash'
import { useAutoSub } from 'jazz-react'
import { CoMap, CoList } from 'cojson'
import { iitsLogoMap, xys } from './util.ts'
import QRCode from 'react-qr-code'

type Message = CoMap<{ text: string }>
type Chat = CoList<Message['id']>
type Logo = CoMap

export function App() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden dark:bg-black dark:text-neutral-100">
      <div className="flex justify-between p-4">
        <div className="text-xl">iits a chat</div>
        <button
          onClick={useJazz().logOut}
          className="rounded px-2 py-1 bg-stone-200 dark:bg-stone-800 dark:text-white self-end"
        >
          Log Out
        </button>
      </div>
      {HashRoute(
        {
          '/': <IndexPage />,
          '/chat/:id': (id) => (
            <ChatPage
              chatId={id.split('||')[0] as Chat['id']}
              logoId={id.split('||')[1] as Logo['id']}
            />
          ),
        },
        { reportToParentFrame: true },
      )}
    </div>
  )
}

export function IndexPage() {
  const { me } = useJazz()
  return (
    <button
      className="rounded py-2 px-4 bg-stone-200 dark:bg-stone-800 dark:text-white my-auto"
      onClick={() => {
        const group = me.createGroup().addMember('everyone', 'writer')
        const chat = group.createList<Chat>()
        const logo = group.createMap<Logo>(iitsLogoMap)
        location.hash = '/chat/' + chat.id + '||' + logo.id
      }}
    >
      Create New Chat
    </button>
  )
}

export function ChatPage(props: { chatId: Chat['id']; logoId: Logo['id'] }) {
  const chat = useAutoSub(props.chatId)
  const logo = useAutoSub(props.logoId)

  return (
    <div className="flex overflow-hidden pl-4 pb-4 gap-x-6 h-full">
      <div className="flex flex-col justify-between">
        <ChatLogo
          data={xys.map(([x, y]) => ({ x, y, value: !!logo?.[`${x},${y}`] }))}
          onClick={(x, y, value) => {
            logo?.set(`${x},${y}`, !value)
          }}
        />
        <QRCode
          value={location.href}
          className="w-32 h-32 lg:w-64 lg:h-64"
          bgColor="rgb(185 28 28)"
          fgColor="white"
        />
      </div>
      <div className="grow flex flex-col items-stretch">
        <div className="flex-grow flex flex-col overflow-y-auto px-2">
          {chat?.map((msg, i) =>
            msg ? (
              <ChatBubble
                id={msg.id}
                key={msg.id}
                text={msg.text}
                by={chat.meta.edits[i].by?.profile?.name}
                byMe={chat.meta.edits[i].by?.isMe}
                at={chat.meta.edits[i].at}
              />
            ) : null,
          )}
        </div>
        <ChatInput
          disabled={!chat}
          onSubmit={(text) => {
            const msg = chat?.meta.group.createMap<Message>({ text })
            if (msg) {
              chat?.append(msg.id)
              setTimeout(() => document.getElementById(msg.id)?.scrollIntoView(), 500)
            }
          }}
        />
      </div>
    </div>
  )
}

function ChatBubble(props: { id: string; text?: string; by?: string; at?: Date; byMe?: boolean }) {
  return (
    <div className={`${props.byMe ? 'items-end' : 'items-start'} flex flex-col`} id={props.id}>
      <div className="rounded-xl bg-stone-100 dark:bg-stone-700 dark:text-white py-2 px-4 mt-2 min-w-[5rem]">
        {props.text}
      </div>
      <div className="text-xs text-neutral-500 ml-2">
        {props.by} at {props.at?.toLocaleTimeString()}
      </div>
    </div>
  )
}

function ChatInput(props: { onSubmit: (text: string) => void; disabled?: boolean }) {
  return (
    <input
      className="rounded p-2 mr-2 border mt-auto dark:bg-black dark:text-white dark:border-stone-700"
      placeholder="Type a message and press Enter"
      onKeyDown={({ key, currentTarget: input }) => {
        if (key !== 'Enter' || !input.value) return
        props.onSubmit(input.value)
        input.value = ''
      }}
      disabled={props.disabled}
    />
  )
}

function ChatLogo({
  data,
  onClick,
}: {
  data: Array<{ x: number; y: number; value: boolean }>
  onClick: (x: number, y: number, value: boolean) => void
}) {
  return (
    <div className="grid grid-cols-[repeat(16,1fr)] auto-rows-auto gap-[1px] bg-stone-600 w-32 h-32 lg:w-64 lg:h-64">
      {data.map(({ x, y, value }) => (
        <div
          className={value ? 'bg-white' : 'bg-red-700'}
          onClick={() => onClick(x, y, value)}
        ></div>
      ))}
    </div>
  )
}
