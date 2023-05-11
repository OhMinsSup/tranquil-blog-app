import React from 'react';
import classNames from 'classnames';
import { buttonVariants } from '~/components/blog/ui/Button';

export default function HeaderNav() {
  return (
    <div className="hidden flex-col mx-2 mt-5 gap-x-5 gap-y-4 font-medium lg:flex lg:flex-row lg:items-center lg:mx-0 lg:mt-0">
      <div className="leading-loose divide-incl-y lg:space-x-3.5 lg:flex-none lg:select-none lg:children:inline-block lg:divide-incl-y-0">
        <div className="dark:border-gray-700">
          <a
            className={classNames(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'px-4',
            )}
            href="/signin"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
