import { FC, Fragment, useContext } from 'react';

import { updateConversationLastUpdatedAtTimeStamp } from '@/utils/app/conversation';
import { savePrompts } from '@/utils/app/prompts';
import { generateRank, reorderItem } from '@/utils/app/rank';

import { Prompt } from '@/types/prompt';

import DropArea from '@/components/DropArea/DropArea';
import HomeContext from '@/components/home/home.context';

import { PromptComponent } from './Prompt';

interface Props {
  prompts: Prompt[];
}

export const Prompts: FC<Props> = ({ prompts }) => {
  const {
    state: { currentDrag, prompts: unfilteredPrompts },
    dispatch,
  } = useContext(HomeContext);

  const handleCanDrop = (): boolean => {
    return !!currentDrag && currentDrag.type === 'prompt';
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, index: number): void => {
    if (currentDrag) {
      const prompt = currentDrag.data as Prompt;
      const reorderedPrompts = reorderItem(
        unfilteredPrompts,
        prompt.id,
        generateRank(
          unfilteredPrompts.filter((p) => p.folderId == null),
          index,
        ),
        { updates: { folderId: null } },
      );
      dispatch({ field: 'prompts', value: reorderedPrompts });
      savePrompts(reorderedPrompts);
      updateConversationLastUpdatedAtTimeStamp();
    }
    e.stopPropagation();
  };

  return (
    <div className="flex w-full flex-col rounded-lg">
      <DropArea
        allowedDragTypes={['prompt']}
        canDrop={handleCanDrop}
        index={0}
        onDrop={(e) => handleDrop(e, 0)}
      />
      {prompts.map((prompt, index) => (
        <Fragment key={prompt.id}>
          <PromptComponent prompt={prompt} />
          <DropArea
            allowedDragTypes={['prompt']}
            canDrop={handleCanDrop}
            index={index + 1}
            onDrop={(e) => handleDrop(e, index + 1)}
          />
        </Fragment>
      ))}
    </div>
  );
};
