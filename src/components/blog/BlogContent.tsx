import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";

interface BlogContentProps {
  content: string;
}

const BlogContent = ({ content }: BlogContentProps) => (
  <div
    className="prose prose-invert prose-lg max-w-none
      prose-headings:font-display prose-headings:text-foreground
      prose-p:text-muted-foreground prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-foreground
      prose-img:rounded-2xl prose-img:border prose-img:border-white/10
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-secondary prose-pre:border prose-pre:border-white/10
      prose-li:text-muted-foreground
      prose-hr:border-white/10"
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug]}>
      {content}
    </ReactMarkdown>
  </div>
);

export default BlogContent;
