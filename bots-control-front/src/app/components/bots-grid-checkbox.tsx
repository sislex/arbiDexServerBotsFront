import { useEffect, useRef } from 'react';
import type { ICellRendererParams, IHeaderParams } from 'ag-grid-community';

export interface BotsGridCheckboxHeaderParams extends IHeaderParams {
  checked: boolean;
  indeterminate: boolean;
  onToggle: () => void;
}

export function BotsGridCheckboxHeader(props: BotsGridCheckboxHeaderParams) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = props.indeterminate;
    }
  }, [props.indeterminate]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        checked={props.checked}
        onChange={props.onToggle}
        onClick={(event) => event.stopPropagation()}
        className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
      />
    </div>
  );
}

export interface BotsGridCheckboxCellParams extends ICellRendererParams {
  isSelected: (id: string) => boolean;
  onToggle: (id: string) => void;
  isDisabled: (id: string) => boolean;
}

export function BotsGridCheckboxCell(props: BotsGridCheckboxCellParams) {
  const rowId = String(props.data?.id ?? '');
  if (!rowId) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <input
        type="checkbox"
        checked={props.isSelected(rowId)}
        disabled={props.isDisabled(rowId)}
        onChange={() => props.onToggle(rowId)}
        onClick={(event) => event.stopPropagation()}
        className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
