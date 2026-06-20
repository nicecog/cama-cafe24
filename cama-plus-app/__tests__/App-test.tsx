/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';
import { PROD_WEBVIEW_URL, resolveWebViewUrl } from '@/config/webviewShell';

jest.mock('react-native-bootsplash', () => ({
  __esModule: true,
  default: {
    hide: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    WebView: React.forwardRef(
      (
        {
          source,
          testID,
        }: {
          source: { uri: string };
          testID?: string;
        },
        _ref: unknown,
      ) => <View testID={testID} source={source} />,
    ),
  };
});

it('renders webview shell with dev webview url', () => {
  const tree = renderer.create(<App />);
  const webview = tree.root.findByProps({ testID: 'patient-webview' });

  expect(webview.props.source.uri).toBe('http://localhost:5173/');
  tree.unmount();
});

it('uses cafe24 url for release builds', () => {
  expect(resolveWebViewUrl(false)).toBe(PROD_WEBVIEW_URL);
});
