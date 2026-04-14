import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

@Directive({
  selector: '[appDatePicker]',
  standalone: true,
})
export class DatePickerDirective implements OnInit, OnChanges, OnDestroy {
  /** Valor en formato YYYY-MM-DD */
  @Input() appDatePicker: string | null = null;
  @Output() appDatePickerChange = new EventEmitter<string | null>();

  private fp: ReturnType<typeof flatpickr> | null = null;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    this.fp = flatpickr(this.el.nativeElement, {
      locale: Spanish,
      dateFormat: 'Y-m-d',
      defaultDate: this.appDatePicker ?? undefined,
      disableMobile: false,
      allowInput: false,
      onChange: (_dates: Date[], dateStr: string) => {
        this.appDatePickerChange.emit(dateStr || null);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appDatePicker'] && this.fp) {
      const val = changes['appDatePicker'].currentValue;
      (this.fp as any).setDate(val ?? '', false);
    }
  }

  ngOnDestroy() {
    (this.fp as any)?.destroy();
  }
}
