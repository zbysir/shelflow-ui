import {useState} from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft} from "lucide-react";

interface Props {
    curPage: number;
    total: number;
    pageSize: number;
    pageChange: (page: number) => void;
    pageSizeChange: (pageSize: number) => void;
}

export default function Pagination({curPage = 1, total, pageSize = 10, pageChange, pageSizeChange}: Props) {
    const [page, setPage] = useState(curPage)
    const [pageCount, setPageCount] = useState(Math.ceil(total / pageSize))
    const changeHandle = (v: string) => {
        setPageCount(Math.ceil(total / Number(v)))
        pageSizeChange(Number(v))
    }

    const prePage = () => {
        if (page > 1) {
            setPage(page - 1)
            pageChange(page - 1)
        }
    }
    const nextPage = () => {
        if (page < pageCount) {
            setPage(page + 1)
            pageChange(page + 1)
        }
    }
    const setPageIndex = (page: number) => {
        setPage(page)
        pageChange(page)
    }
    return <div className="flex items-center space-x-2">
        <p className="text-sm font-medium"> Rows per page</p>
        <Select
            value={`${pageSize}`}
            onValueChange={changeHandle}>
            <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize}/>
            </SelectTrigger>
            <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {page} of {pageCount}
        </div>


        <div className="flex items-center space-x-2">
            <Button variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    disabled={page === 1}
                    onClick={() => {
                        setPageIndex(1)
                    }}
            >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft
                    className="h-4 w-4">
                </ChevronsLeft>
            </Button>
            <Button variant="outline"
                    className="h-8 w-8 p-0"
                    disabled={page === 1}
                    onClick={() => {
                        prePage()
                    }}>
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft
                    className="h-4 w-4"></ChevronLeft>
            </Button>
            <Button variant="outline"
                    className="h-8 w-8 p-0"
                    disabled={page === pageCount - 1}
                    onClick={() => {
                        nextPage()
                    }}>
                <span className="sr-only">Go to next page</span>
                <ChevronRight
                    className="h-4 w-4">
                </ChevronRight>
            </Button>
            <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled={page === pageCount}
                onClick={() => setPageIndex(pageCount)}>
                <span className="sr-only">Go to last page</span>
                <ChevronsRight
                    className="h-4 w-4"></ChevronsRight>
            </Button>
        </div>
    </div>
}