/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import testContext from '../testContext';

const pageId = 'one';
const rootContext = {};

const RealDate = Date;
const mockDate = jest.fn(() => ({ date: 0 }));
mockDate.now = jest.fn(() => 0);

beforeAll(() => {
  global.Date = mockDate;
});

afterAll(() => {
  global.Date = RealDate;
});

test('CallMethod with no args, synchronous method', async () => {
  const blockMethod = jest.fn((...args) => ({ args }));
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'textInput',
            type: 'TextInput',
            meta: {
              category: 'input',
              valueType: 'string',
            },
          },
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [
                {
                  id: 'a',
                  type: 'CallMethod',
                  params: { blockId: 'textInput', method: 'blockMethod' },
                },
              ],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
    initState: { textInput: 'init' },
  });
  const { button, textInput } = context.RootBlocks.map;

  textInput.registerMethod('blockMethod', blockMethod);
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(res).toEqual({
    blockId: 'button',
    event: undefined,
    eventName: 'onClick',
    responses: [
      {
        actionId: 'a',
        actionType: 'CallMethod',
        response: {
          args: [],
        },
      },
    ],
    success: true,
    timestamp: new Date(),
  });
  expect(blockMethod.mock.calls).toEqual([[]]);
});

test('CallMethod method return a promise', async () => {
  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const calls = [];
  const blockMethod = async (...args) => {
    calls.push(args);
    await timeout(300);
    return { args };
  };
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'textInput',
            type: 'TextInput',
            meta: {
              category: 'input',
              valueType: 'string',
            },
          },
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [
                {
                  id: 'a',
                  type: 'CallMethod',
                  params: { blockId: 'textInput', method: 'blockMethod', args: ['arg'] },
                },
              ],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
    initState: { textInput: 'init' },
  });
  const { button, textInput } = context.RootBlocks.map;

  textInput.registerMethod('blockMethod', blockMethod);
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(res).toEqual({
    blockId: 'button',
    event: undefined,
    eventName: 'onClick',
    responses: [
      {
        actionId: 'a',
        actionType: 'CallMethod',
        response: {
          args: ['arg'],
        },
      },
    ],
    success: true,
    timestamp: {
      date: 0,
    },
  });
  expect(calls).toEqual([['arg']]);
});

test('CallMethod with args not an array', async () => {
  const blockMethod = jest.fn((...args) => ({ args }));
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'textInput',
            type: 'TextInput',
            meta: {
              category: 'input',
              valueType: 'string',
            },
          },
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [
                {
                  id: 'a',
                  type: 'CallMethod',
                  params: { blockId: 'textInput', method: 'blockMethod', args: 'arg' },
                },
              ],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
    initState: { textInput: 'init' },
  });
  const { button, textInput } = context.RootBlocks.map;

  textInput.registerMethod('blockMethod', blockMethod);
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(res).toEqual({
    blockId: 'button',
    event: undefined,
    eventName: 'onClick',
    responses: [
      {
        actionId: 'a',
        actionType: 'CallMethod',
        error: new Error(
          'Failed to call method "blockMethod" on block "textInput": "args" should be an array.'
        ),
      },
    ],
    success: false,
    timestamp: {
      date: 0,
    },
  });
  expect(blockMethod.mock.calls).toEqual([]);
});

test('CallMethod with multiple positional args, synchronous method', async () => {
  const blockMethod = jest.fn((...args) => ({ args }));
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'textInput',
            type: 'TextInput',
            meta: {
              category: 'input',
              valueType: 'string',
            },
          },
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [
                {
                  id: 'a',
                  type: 'CallMethod',
                  params: { blockId: 'textInput', method: 'blockMethod', args: ['arg1', 'arg2'] },
                },
              ],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
    initState: { textInput: 'init' },
  });
  const { button, textInput } = context.RootBlocks.map;

  textInput.registerMethod('blockMethod', blockMethod);
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(res).toEqual({
    blockId: 'button',
    event: undefined,
    eventName: 'onClick',
    responses: [
      {
        actionId: 'a',
        actionType: 'CallMethod',
        response: {
          args: ['arg1', 'arg2'],
        },
      },
    ],
    success: true,
    timestamp: {
      date: 0,
    },
  });
  expect(blockMethod.mock.calls).toEqual([['arg1', 'arg2']]);
});

test('CallMethod of block in array by explicit id', async () => {
  const blockMethod0 = jest.fn((...args) => ({ args }));
  const blockMethod1 = jest.fn((...args) => ({ args }));
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'list',
            type: 'List',
            meta: {
              category: 'list',
              valueType: 'array',
            },
            areas: {
              content: {
                blocks: [
                  {
                    blockId: 'list.$.textInput',
                    type: 'TextInput',
                    defaultValue: '123',
                    meta: {
                      category: 'input',
                      valueType: 'string',
                    },
                  },
                ],
              },
            },
          },
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [
                {
                  id: 'a',
                  type: 'CallMethod',
                  params: { blockId: 'list.0.textInput', method: 'blockMethod', args: ['arg'] },
                },
              ],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
    initState: { list: [{ textInput: '0' }, { textInput: '1' }] },
  });

  const { button } = context.RootBlocks.map;
  const textInput0 = context.RootBlocks.map['list.0.textInput'];
  const textInput1 = context.RootBlocks.map['list.1.textInput'];

  textInput0.registerMethod('blockMethod', blockMethod0);
  textInput1.registerMethod('blockMethod', blockMethod1);
  await button.triggerEvent({ name: 'onClick' });
  expect(blockMethod0.mock.calls).toEqual([['arg']]);
  expect(blockMethod1.mock.calls).toEqual([]);
});

test('CallMethod of block in array by block with same indices and id pattern', async () => {
  const blockMethod0 = jest.fn((...args) => ({ args }));
  const blockMethod1 = jest.fn((...args) => ({ args }));
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'list',
            type: 'List',
            meta: {
              category: 'list',
              valueType: 'array',
            },
            areas: {
              content: {
                blocks: [
                  {
                    blockId: 'list.$.textInput',
                    type: 'TextInput',
                    defaultValue: '123',
                    meta: {
                      category: 'input',
                      valueType: 'string',
                    },
                  },
                  {
                    blockId: 'list.$.button',
                    type: 'Button',
                    meta: {
                      category: 'display',
                      valueType: 'string',
                    },
                    events: {
                      onClick: [
                        {
                          id: 'a',
                          type: 'CallMethod',
                          params: {
                            blockId: 'list.$.textInput',
                            method: 'blockMethod',
                            args: ['arg'],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
    initState: { list: [{ textInput: '0' }, { textInput: '1' }] },
  });

  const textInput0 = context.RootBlocks.map['list.0.textInput'];
  const textInput1 = context.RootBlocks.map['list.1.textInput'];
  const button0 = context.RootBlocks.map['list.0.button'];
  const button1 = context.RootBlocks.map['list.1.button'];

  textInput0.registerMethod('blockMethod', blockMethod0);
  textInput1.registerMethod('blockMethod', blockMethod1);
  await button1.triggerEvent({ name: 'onClick' });
  expect(blockMethod0.mock.calls).toEqual([]);
  expect(blockMethod1.mock.calls).toEqual([['arg']]);

  await button0.triggerEvent({ name: 'onClick' });
  expect(blockMethod0.mock.calls).toEqual([['arg']]);
  expect(blockMethod1.mock.calls).toEqual([['arg']]);
});
