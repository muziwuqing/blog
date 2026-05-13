interface Props {
  tags: { tag: string; count: number }[];
}

export default function TagCloud({ tags }: Props) {
  return (
    <div class="flex flex-wrap gap-3">
      {tags.map(({ tag, count }) => (
        <a
          href={`/tags/${tag}`}
          class="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-all hover:border-primary hover:text-primary hover:shadow-md dark:border-border-dark dark:hover:border-primary-dark dark:hover:text-primary-dark"
        >
          <span>{tag}</span>
          <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary-dark/10 dark:text-primary-dark">
            {count}
          </span>
        </a>
      ))}
    </div>
  );
}
