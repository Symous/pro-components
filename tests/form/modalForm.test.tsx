﻿import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Button } from 'antd';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { waitForComponentToPaint, waitTime } from '../util';

describe('ModalForm', () => {
  it('📦 trigger will simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(true);
  });

  it('📦 submitter config no reset default config', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
          resetButtonProps: {
            style: {
              width: '80px',
            },
            id: 'reset',
          },
        }}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper, 200);
    expect(fn).toBeCalledWith(true);

    act(() => {
      wrapper.find('button#reset').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(false);
  });

  it('📦 ModalForm first no render items', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeFalsy();

    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('input#test').exists()).toBeTruthy();
  });

  it('📦 ModalForm first render items', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        modalProps={{
          forceRender: true,
        }}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeTruthy();
  });

  it('📦 ModalForm destroyOnClose', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        modalProps={{ destroyOnClose: true }}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeFalsy();

    act(() => {
      wrapper.setProps({
        visible: true,
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeTruthy();

    act(() => {
      wrapper.setProps({
        visible: false,
      });
    });
    await waitForComponentToPaint(wrapper, 2000);

    expect(wrapper.find('input#test').exists()).toBeFalsy();
  });

  it('📦 modal close button will simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(false);
    expect(fn).toBeCalledTimes(2);
  });

  it('📦 modal visible=true simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(true);
  });

  it('📦 reset button will simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-modal-footer').update().find('button.ant-btn').at(0).simulate('click');
    });
    expect(fn).toBeCalledWith(false);
  });

  it('📦 modal close button will simulate modalProps.onCancel', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        modalProps={{
          onCancel: () => fn(false),
        }}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(false);
  });

  it('📦 form onFinish return true should close modal', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
        onFinish={async () => true}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper, 500);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(false);
  });

  it('📦 form onFinish is null, no close modal', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper, 500);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledTimes(1);
  });

  it('📦 ModalForm support submitter is false', async () => {
    const wrapper = mount(
      <ModalForm visible trigger={<Button id="new">新建</Button>} submitter={false}>
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-modal-footer').length).toBe(0);
  });

  it('📦 ModalForm close no rerender from', async () => {
    const wrapper = mount(
      <ModalForm
        initialValues={{
          name: '1234',
        }}
        trigger={<Button id="new">新建</Button>}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 300);
    act(() => {
      wrapper
        .find('.ant-input#test')
        .at(0)
        .simulate('change', {
          target: {
            value: 'test',
          },
        });
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('input#test').props().value).toEqual('test');
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').props().value).toEqual('test');
  });

  it('📦 ModalForm destroyOnClose close will rerender from', async () => {
    const wrapper = mount(
      <ModalForm
        modalProps={{
          getContainer: false,
          destroyOnClose: true,
        }}
        initialValues={{
          name: '1234',
        }}
        trigger={<Button id="new">新建</Button>}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button#new').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 300);
    act(() => {
      wrapper
        .find('.ant-input#test')
        .at(0)
        .simulate('change', {
          target: {
            value: '1111',
          },
        });
    });

    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('input#test').props().value).toEqual('1111');

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').props().value).toEqual('1234');
  });

  it('📦 modal submitTimeout is number will disabled close button when submit', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        modalProps={{
          onCancel: () => fn(),
        }}
        onFinish={async () => {
          await waitTime(2000);
        }}
        submitTimeout={3000}
      />,
    );
    await waitForComponentToPaint(wrapper, 500);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 500);

    expect(wrapper.find('button.ant-btn-default').props().disabled).toEqual(true);

    act(() => {
      wrapper.find('.ant-modal-close').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 500);

    expect(fn).not.toBeCalled();

    await waitForComponentToPaint(wrapper, 2500);

    expect(wrapper.find('button.ant-btn-default').props().disabled).toEqual(false);

    act(() => {
      wrapper.find('.ant-modal-close').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 500);

    expect(fn).toBeCalled();

    act(() => {
      wrapper.unmount();
    });
  });

  it('📦 modal submitTimeout is null no disable close button when submit', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        modalProps={{
          onCancel: () => fn(),
        }}
        onFinish={async () => {
          await waitTime(2000);
        }}
      />,
    );
    await waitForComponentToPaint(wrapper, 500);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 500);

    expect(wrapper.find('button.ant-btn-default').props().disabled).toEqual(undefined);

    act(() => {
      wrapper.find('.ant-modal-close').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 500);

    expect(fn).toBeCalled();

    act(() => {
      wrapper.unmount();
    });
  });

  it('📦 model no render Form when destroyOnClose', () => {
    const { container } = render(
      <ModalForm
        modalProps={{
          destroyOnClose: true,
        }}
        trigger={
          <Button id="new" type="primary">
            新建
          </Button>
        }
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    expect(container.querySelector('form')).toBeFalsy();
  });

  it('📦 ModelForm get formRef when destroyOnClose', async () => {
    const ref = React.createRef<any>();

    const html = mount(
      <ModalForm
        formRef={ref}
        modalProps={{
          destroyOnClose: true,
        }}
        trigger={
          <Button id="new" type="primary">
            新建
          </Button>
        }
      >
        <ProFormText name="name" />
      </ModalForm>,
    );

    waitForComponentToPaint(html, 200);
    expect(ref.current).toBeFalsy();
    act(() => {
      html.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(html, 200);

    expect(ref.current).toBeTruthy();

    html.unmount();
  });
});
