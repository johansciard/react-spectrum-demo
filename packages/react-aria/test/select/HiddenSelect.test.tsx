import {act, render, screen} from '@testing-library/react';
import {HiddenSelect, HiddenSelectProps} from '../../src/select/HiddenSelect';
import {Item} from 'react-stately/Item';
import {pointerMap} from '@react-spectrum/test-utils-internal';
import React, {useRef} from 'react';
import {SelectProps, useSelectState} from 'react-stately/useSelectState';
import userEvent from '@testing-library/user-event';

const HiddenSelectExample = (
  props: Partial<SelectProps<{key: number; value: string}>> & {
    hiddenProps?: Partial<HiddenSelectProps<any>>;
  }
) => {
  const triggerRef = useRef(null);
  const state = useSelectState({
    children: item => <Item>{item.value}</Item>,
    ...props
  });

  return (
    <>
      <HiddenSelect
        label={props.label}
        state={state}
        triggerRef={triggerRef}
        {...props.hiddenProps}
      />
      <button ref={triggerRef}>trigger</button>
    </>
  );
};

const makeItems = (size: number) =>
  new Array(size).fill('').map((__, index) => ({
    key: index + 1,
    value: `${index + 1}`
  }));

describe('<HiddenSelect />', () => {
  let user;
  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
  });

  it('should successfully render for collection.size <= 300 and no selected key', () => {
    render(<HiddenSelectExample items={makeItems(5)} />);
  });

  it('should successfully render for collection.size > 300 with a name and no selected key', () => {
    render(
      <HiddenSelectExample
        hiddenProps={{
          name: 'select'
        }}
        items={makeItems(400)}
      />
    );
  });

  it('should have form value after initial render', async () => {
    let formRef = React.createRef<HTMLFormElement>();
    render(
      <form ref={formRef}>
        <HiddenSelectExample
          value="value"
          hiddenProps={{
            name: 'select'
          }}
          items={[]}
        />
      </form>
    );

    let formData = new FormData(formRef.current!);
    expect(formData.get('select')).toEqual('value');
  });

  it('should trigger on onSelectionChange when select onchange is triggered (autofill)', async () => {
    const onSelectionChange = jest.fn();
    const onFormChange = jest.fn();
    render(
      <form onChange={onFormChange}>
        <HiddenSelectExample
          label="select"
          onSelectionChange={onSelectionChange}
          items={makeItems(5)}
        />
      </form>
    );

    const select = screen.getByLabelText('select');
    await user.selectOptions(select, '5');
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith('5');
    expect(onFormChange).toHaveBeenCalledTimes(1);
  });

  it('should bubble a change event to the form when the selected key changes', async () => {
    const onFormChange = jest.fn();
    function Example() {
      const triggerRef = useRef(null);
      const state = useSelectState({
        items: makeItems(5),
        children: item => <Item>{item.value}</Item>
      });

      return (
        <form onChange={onFormChange}>
          <HiddenSelect label="select" state={state} triggerRef={triggerRef} />
          <button type="button" ref={triggerRef} onClick={() => state.setSelectedKey('5')}>
            choose
          </button>
        </form>
      );
    }

    render(<Example />);
    await user.click(screen.getByRole('button', {name: 'choose'}));
    expect(onFormChange).toHaveBeenCalledTimes(1);
    expect(onFormChange.mock.calls[0][0].target).toHaveValue('5');
  });

  it('should not bubble a change event when the form is reset', async () => {
    const onFormChange = jest.fn();
    let formRef = React.createRef<HTMLFormElement>();
    render(
      <form ref={formRef} onChange={onFormChange}>
        <HiddenSelectExample label="select" defaultSelectedKey="5" items={makeItems(5)} />
      </form>
    );

    const select = screen.getByLabelText('select');
    await user.selectOptions(select, '1');
    expect(onFormChange).toHaveBeenCalledTimes(1);
    onFormChange.mockClear();

    act(() => {
      formRef.current!.reset();
    });
    expect(onFormChange).not.toHaveBeenCalled();
  });

  it('should include a non-empty placeholder option for native select markup', () => {
    render(<HiddenSelectExample label="select" items={makeItems(5)} />);

    let select = screen.getByLabelText('select');
    let firstOption = select.querySelector('option')!;

    expect(firstOption).toHaveAttribute('value', '');
    expect(firstOption).toHaveAttribute('label', '\u00A0');
  });

  it('should submit an empty string when no value is selected', () => {
    let formRef = React.createRef<HTMLFormElement>();
    render(
      <form ref={formRef}>
        <HiddenSelectExample
          hiddenProps={{
            name: 'select'
          }}
          items={makeItems(5)}
        />
      </form>
    );

    let formData = new FormData(formRef.current!);
    expect(formData.get('select')).toEqual('');
  });

  it('should always add a data attribute data-a11y-ignore="aria-hidden-focus"', () => {
    render(<HiddenSelectExample items={makeItems(5)} />);

    expect(screen.getByTestId('hidden-select-container')).toHaveAttribute(
      'data-a11y-ignore',
      'aria-hidden-focus'
    );
  });

  it('should always add a data attribute data-react-aria-prevent-focus', () => {
    render(<HiddenSelectExample items={makeItems(5)} />);

    expect(screen.getByTestId('hidden-select-container')).toHaveAttribute(
      'data-react-aria-prevent-focus'
    );
  });
});
