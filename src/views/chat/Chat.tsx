import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import {MessageCircle, User} from 'lucide-react'
import {Textarea} from "@/components/ui/textarea"

const ChatBox = () => {
    const chatList = [
        {
            ask: true,
            avatar: '',
            content: '成都应该如何游玩，请用40个字回答'
        },
        {
            avatar: '',
            content: '游世界遗产大熊猫基地，尝美食小吃和火锅，游锦里、宽窄巷子，还可观天府广场和清新的都江堰水利工程。'
        },
        {
            ask: true,
            avatar: '',
            content: '成都应该如何游玩，请用40个字回答'
        },
        {
            avatar: '',
            content: '游世界遗产大熊猫基地，尝美食小吃和火锅，游锦里、宽窄巷子，还可观天府广场和清新的都江堰水利工程。'
        },
        {
            ask: true,
            avatar: '',
            content: '成都应该如何游玩，请用40个字回答'
        },
        {
            avatar: '',
            content: '游世界遗产大熊猫基地，尝美食小吃和火锅，游锦里、宽窄巷子，还可观天府广场和清新的都江堰水利工程。'
        }
    ]
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="w-10 rounded-full p-0 absolute z-50 top-4 right-4 shadow-xl">
                    <MessageCircle></MessageCircle>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] h-[70vh] relative flex flex-col">
                <div className={`overflow-auto text-sm pb-4`}>
                    {chatList.map((item, index) => (
                        <div className={`p-2 flex space-x-2 mb-2 ${item.ask?'':'bg-secondary'}`}>
                            <div className="w-8 h-8  bg-secondary rounded-full p-1">
                                <User></User>
                            </div>
                            <div className="chat-item-content">
                                {item.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-none">
                    <Textarea
                        placeholder="type your question"/>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ChatBox