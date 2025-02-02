import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useTeacherTags from '@/hooks/teacherPortal/useTeacherTags';

import { Tag as TagType } from '@/types/tags';

import { Button } from '../ui/button';
import NewTagButton from './Tags/NewTagButton';
import Tag from './Tags/Tag';

const Tags = () => {
  const isPeriodicFlag = useRef(false);
  const { fetchQuery } = useTeacherTags(isPeriodicFlag.current);
  const tags: TagType[] = fetchQuery.data || [];
  const { t } = useTranslation('model');
  const { removeTeacherTags, addTeacherTag } = useTeacherTags();
  const { mutateAsync: removeTags } = removeTeacherTags;
  const { mutate: addTag } = addTeacherTag;
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    isPeriodicFlag.current = true;
  }, []);
  const handleRemoveTag = () => {
    const selectedTagDetails = tags.filter((tag) =>
      selectedTags.includes(tag.id),
    );
    const allTagsHaveNoMessages = selectedTagDetails.every(
      (tag) => tag.message_count === 0,
    );
    const proceedWithRemoval =
      allTagsHaveNoMessages ||
      confirm(
        t(
          'Selected tags have student submissions. Are you sure you want to remove all selected tags?',
        ) as string,
      );

    if (proceedWithRemoval) {
      removeTags(selectedTags).then((res) => {
        if (res.isRemoved) {
          setSelectedTags([]);
        }
      });
    }
  };
  return (
    <div>
      <h1 className="font-bold mb-4">{t('Tags')}</h1>
      <div className="flex gap-4 flex-wrap mb-8 content-start">
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            label={tag.name}
            count={tag.message_count}
            onSelect={() => {
              if (selectedTags.includes(tag.id)) {
                setSelectedTags(selectedTags.filter((id) => id !== tag.id));
              } else {
                setSelectedTags([...selectedTags, tag.id]);
              }
            }}
            selected={selectedTags.includes(tag.id)}
          />
        ))}
      </div>
      <div className="flex items-center">
        <NewTagButton
          onAddTag={(tag_name) => {
            addTag(tag_name);
          }}
        />
        <Button
          onClick={handleRemoveTag}
          variant={selectedTags.length === 0 ? 'outline' : 'destructive'}
          disabled={selectedTags.length === 0}
          className="transition-[background]"
        >
          {t('Remove')}
        </Button>
      </div>
    </div>
  );
};

export default Tags;
