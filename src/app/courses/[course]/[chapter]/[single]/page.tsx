import { generateHtml } from "@/layouts/editor/utils/generateHtml"
import parse from 'html-react-parser';
import Workspace from "@/components/workSpace/WorkSpace";
import TopBar from "@/components/topBar/TopBar";
import { JSDOM } from "jsdom";
import playgroundTemplate from './example.json';
import type { EditorDocument } from './types';
import CommentsSection from "@/components/comments/CommentsSection";

// import "mathlive/static.css";
// import '@/layouts/editor/theme.css';
//import { db } from '@/lib/db'
// import { authOptions } from '@/lib/auth'
// import { getServerSession } from 'next-auth'


interface PageProps {
    params: {
        chapter: string,
        problems: string,
        single: string
    }
}
let solution: any = null
const singleProblem = async ({ params }: PageProps) => {
    // const session = await getServerSession(authOptions);
    const develop = process.env.DATABASE_URL === undefined || process.env.DATABASE_URL === null;
    if (develop) {
        const dom = new JSDOM()
        global.window = dom.window as unknown as Window & typeof globalThis
        global.document = dom.window.document
        global.DocumentFragment = dom.window.DocumentFragment
        global.Element = dom.window.Element
        global.navigator = dom.window.navigator
        const document = playgroundTemplate as unknown as EditorDocument;

        const html = await generateHtml(document.data);

        solution = parse(html);
    }

    return (
        <>
            {/* <PageHeader title={params.single} /> */}
            <div className="my-5">
                <TopBar title={params.single} />
            </div>
            <Workspace problemId={params.single} solution={solution}>
                {develop ? null : <CommentsSection problemId={1} comments={[]} />}
            </Workspace>
        </>
    );
};
export default singleProblem;
