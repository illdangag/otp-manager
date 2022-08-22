// react, element
import { useRouter, } from 'next/router';
import { IconButton, VStack, } from '@chakra-ui/react';
import OpenSourceLicense from '../../components/OpenSourceLicense';
import Layout from '../../components/Layout';
import { NavigateBefore, } from '../../icons';

interface LicenseInfo {
  title: string,
  link?: string,
  copyright?: string,
  license: string,
}

const LicensePage = () => {
  const router = useRouter();

  const onClickBeforeButton = async () => {
    await router.push('/');
  };

  const licenseInfoList: LicenseInfo[] = [
    {
      title: '@chakra-ui/icons',
      link: 'https://github.com/chakra-ui/chakra-ui',
      copyright: 'Copyright (c) 2019 Segun Adebayo',
      license: 'MIT',
    },
    {
      title: '@chakra-ui/react',
      link: 'https://github.com/chakra-ui/chakra-ui',
      copyright: 'Copyright (c) 2019 Segun Adebayo',
      license: 'MIT',
    },
    {
      title: '@emotion/react',
      link: 'https://github.com/emotion-js/emotion',
      copyright: 'Copyright (c) Emotion team and other contributors',
      license: 'MIT',
    },
    {
      title: '@emotion/styled',
      link: 'https://github.com/emotion-js/emotion',
      copyright: 'Copyright (c) Emotion team and other contributors',
      license: 'MIT',
    },
    {
      title: 'electron-is-dev',
      link: 'https://github.com/sindresorhus/electron-is-dev',
      copyright: 'Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)',
      license: 'MIT',
    },
    {
      title: 'electron-log',
      link: 'https://github.com/megahertz/electron-log',
      copyright: 'Copyright (c) 2016 Alexey Prokhorov',
      license: 'MIT',
    },
    {
      title: 'electron-next',
      link: 'https://github.com/leo/electron-next',
      copyright: 'Copyright (c) 2017 Leo Lamprecht',
      license: 'MIT',
    },
    {
      title: 'electron-store',
      link: 'https://github.com/sindresorhus/electron-store',
      copyright: 'Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)',
      license: 'MIT',
    },
    {
      title: 'framer-motion',
      link: 'https://github.com/framer/motion',
      copyright: 'Copyright (c) 2018 Framer B.V.',
      license: 'MIT',
    },
    {
      title: 'react',
      link: 'https://github.com/facebook/react',
      copyright: 'Copyright (c) Facebook, Inc. and its affiliates.',
      license: 'MIT',
    },
    {
      title: 'react-dom',
      link: 'https://github.com/facebook/react',
      copyright: 'Copyright (c) Facebook, Inc. and its affiliates.',
      license: 'MIT',
    },
    {
      title: 'sass',
      link: 'https://github.com/sass/dart-sass',
      copyright: 'Copyright (c) 2016, Google Inc.',
      license: 'MIT',
    },
    {
      title: 'uuid',
      link: 'https://github.com/uuidjs/uuid',
      copyright: 'Copyright (c) 2010-2020 Robert Kieffer and other contributors',
      license: 'MIT',
    },
    {
      title: '@types/node',
      link: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
      copyright: 'Copyrights are respective of each contributor listed at the beginning of each definition file.',
      license: 'MIT',
    },
    {
      title: '@types/react',
      link: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
      copyright: 'Copyrights are respective of each contributor listed at the beginning of each definition file.',
      license: 'MIT',
    },
    {
      title: '@types/react',
      link: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
      copyright: 'Copyrights are respective of each contributor listed at the beginning of each definition file.',
      license: 'MIT',
    },
    {
      title: '@types/react-dom',
      link: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
      copyright: 'Copyrights are respective of each contributor listed at the beginning of each definition file.',
      license: 'MIT',
    },
    {
      title: '@types/uuid',
      link: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
      copyright: 'Copyrights are respective of each contributor listed at the beginning of each definition file.',
      license: 'MIT',
    },
    {
      title: '@typescript-eslint/eslint-plugin',
      link: 'https://github.com/typescript-eslint/typescript-eslint',
      copyright: 'Copyright JS Foundation and other contributors, https://js.foundation',
      license: 'MIT',
    },
    {
      title: 'electron',
      link: 'https://github.com/electron/electron',
      copyright: 'Copyright (c) Electron contributors Copyright (c) 2013-2020 GitHub Inc.',
      license: 'MIT',
    },
    {
      title: 'electron-builder',
      link: 'https://github.com/electron-userland/electron-builder',
      copyright: 'Copyright (c) 2015 Loopline Systems',
      license: 'MIT',
    },
    {
      title: 'eslint',
      link: 'https://github.com/eslint/eslint',
      copyright: 'Copyright OpenJS Foundation and other contributors, <www.openjsf.org>',
      license: 'MIT',
    },
    {
      title: 'next',
      link: 'https://github.com/vercel/next.js',
      copyright: 'Copyright (c) 2022 Vercel, Inc.',
      license: 'MIT',
    },
    {
      title: 'recoil',
      link: 'https://github.com/facebookexperimental/Recoil',
      copyright: 'Copyright (c) Facebook, Inc. and its affiliates.',
      license: 'MIT',
    },
    {
      title: 'rimraf',
      link: 'https://github.com/isaacs/rimraf',
      copyright: 'Copyright (c) 2011-2022 Isaac Z. Schlueter and Contributors',
      license: 'ISC',
    },
    {
      title: 'totp-generator',
      link: 'https://github.com/bellstrand/totp-generator',
      copyright: 'Copyright (c) 2016 Magnus Bellstrand',
      license: 'MIT',
    },
    {
      title: 'typescript',
      link: 'https://github.com/Microsoft/TypeScript',
      copyright: 'Copyright (c) Microsoft Corporation. All rights reserved.',
      license: 'Apache-2.0',
    },
    {
      title: 'usehooks-ts',
      link: 'https://github.com/juliencrn/usehooks-ts',
      copyright: 'Copyright (c) 2020 Julien CARON.',
      license: 'MIT',
    },
  ];

  const titleElement = <IconButton
    icon={<NavigateBefore/>}
    aria-label='before page'
    variant='outline'
    onClick={onClickBeforeButton}
  />;

  return (
    <Layout title='OTP Manager' titleElement={titleElement}>
      <VStack flexDirection={'column'} padding='.8rem'>
        {licenseInfoList.map(item => (
          <OpenSourceLicense
            title={item.title}
            link={item.link}
            copyright={item.copyright}
            license={item.license}
          />
        ))}
      </VStack>
    </Layout>
  );
};

export default LicensePage;
