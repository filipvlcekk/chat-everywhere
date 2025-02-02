import {
  IconArrowBack,
  IconBuildingBroadcastTower,
  IconInfoSquareRounded,
  IconMessages,
  IconPrompt,
  IconRating12Plus,
  IconSettings,
  IconTags,
} from '@tabler/icons-react';
import React, { cloneElement, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { trackEvent } from '@/utils/app/eventTracking';

import { Button } from '@/components/ui/button';

type Props = {
  className?: string;
};

type sideBarItemType = {
  icon: JSX.Element;
  name: string;
  value: string;
  callback: () => void;
  overrideClassName?: string;
};

export default function Sidebar({ className = '' }: Props) {
  const { t } = useTranslation('model');
  const router = useRouter();
  const handleBackClick = () => {
    router.push('/');
  };
  const iconClass = 'h-[18px] tablet:h-[22px] tablet:w-[36px]';
  const { slug } = router.query;

  const footerItems: sideBarItemType[] = [
    {
      icon: <IconInfoSquareRounded />,
      name: t('Instructions'),
      value: 'instructions',
      callback: () => {
        window.location.href =
          'https://explorator.notion.site/a68dbc8f3df241a49b62add843a8d364';
      },
    },
    {
      icon: <IconMessages />,
      name: t('Join research group'),
      value: 'join-research-group',
      callback: () => {
        joinLINEGroupOnClick();
      },
    },
    {
      icon: <IconArrowBack />,
      name: t('Back'),
      value: 'back',
      overrideClassName: 'py-5',
      callback: () => {
        handleBackClick();
      },
    },
  ];

  const getRenderItems = (itemsArray: sideBarItemType[]) =>
    itemsArray.map((item, i) => (
      <a
        key={`${i} ${item.name}`}
        href="#"
        className={`outline-none py-2 px-6 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-9000 tablet:px-2 tablet:py-4
          ${slug === item.value ? 'bg-neutral-900 text-neutral-100' : ''}
          ${item.overrideClassName ? item.overrideClassName : ''}
          `}
        onClick={item.callback}
      >
        <div className="flex gap-2 items-center ">
          {cloneElement(item.icon, {
            className: iconClass,
          })}
          <div className="tablet:hidden"> {item.name}</div>
        </div>
      </a>
    ));

  const joinLINEGroupOnClick = () => {
    trackEvent('Join LINE group button clicked');
    toast(
      (tInstance) => (
        <div className="flex flex-col items-center">
          <Image
            src="/assets/teacher_portal_qrcode.jpg"
            alt="QR Code"
            width={200}
            height={200}
          />
          <p className="text-center mb-5">
            {t('Scan the QR code or')}
            <a
              href="https://line.me/R/ti/g/cR6EoQ_ggL"
              target="_blank"
              className="underline"
            >
              {' '}
              {t('click here')}{' '}
            </a>
            {t('to join our focus group to share your feedback.')}
          </p>
          <Button
            variant="secondary"
            onClick={() => toast.dismiss(tInstance.id)}
          >
            {t('Close')}
          </Button>
        </div>
      ),
      {
        duration: 60000,
      },
    );
  };

  return (
    <div className={`${className} flex justify-between flex-col`}>
      <div>
        <b className="pt-6 px-6 block select-none tablet:hidden">
          {t('Teacher Portal')}
        </b>
        <div className="py-6 flex flex-col">
          <Link
            href={'/teacher-portal/one-time-code'}
            className={`outline-none py-2 px-6 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-9000 tablet:px-2 tablet:py-4
          ${slug === 'one-time-code' ? 'bg-neutral-900 text-neutral-100' : ''}
          `}
          >
            <div className="flex gap-2 items-center">
              <IconRating12Plus className={iconClass} />
              <div className="tablet:hidden">{t('One-time code')}</div>
            </div>
          </Link>
          <Link
            href={'/teacher-portal/shared-message'}
            className={`outline-none py-2 px-6 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-9000 tablet:px-2 tablet:py-4
                ${
                  slug === 'shared-message'
                    ? 'bg-neutral-900 text-neutral-100'
                    : ''
                }
                `}
          >
            <div className="flex gap-2 items-center">
              <IconBuildingBroadcastTower className={iconClass} />
              <div className="tablet:hidden">{t('Shared messages')}</div>
            </div>
          </Link>
          <Link
            href={'/teacher-portal/tags'}
            className={`outline-none py-2 px-6 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-9000 tablet:px-2 tablet:py-4
            ${slug === 'tags' ? 'bg-neutral-900 text-neutral-100' : ''}
            `}
          >
            <div className="flex gap-2 items-center">
              <IconTags className={iconClass} />
              <div className="tablet:hidden">{t('Tags')}</div>
            </div>
          </Link>
          <Link
            href={'/teacher-portal/teacher-prompt'}
            className={`outline-none py-2 px-6 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-9000 tablet:px-2 tablet:py-4
            ${
              slug === 'teacher-prompt' ? 'bg-neutral-900 text-neutral-100' : ''
            }
            `}
          >
            <div className="flex gap-2 items-center">
              <IconPrompt className={iconClass} />
              <div className="tablet:hidden">{t('Teacher Prompt')}</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col">
        <Link
          href={'/teacher-portal/settings'}
          className={`outline-none py-2 px-6 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-9000 tablet:px-2 tablet:py-4
          ${slug === 'settings' ? 'bg-neutral-900 text-neutral-100' : ''}
          `}
        >
          <div className="flex gap-2 items-center">
            <IconSettings className={iconClass} />
            <div className="tablet:hidden">{t('Settings')}</div>
          </div>
        </Link>
        {getRenderItems(footerItems)}
      </div>
    </div>
  );
}
