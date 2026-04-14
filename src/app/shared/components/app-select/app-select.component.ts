import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full" (click)="$event.stopPropagation()">
      <!-- Trigger -->
      <button
        type="button"
        (click)="toggle()"
        class="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm bg-white border rounded-xl shadow-sm transition-all duration-200 text-left"
        [class.border-stone-300]="open()"
        [class.ring-2]="open()"
        [class.border-stone-200]="!open()"
        style="{{
          open()
            ? 'ring-color: var(--color-primary)20; outline: 2px solid var(--color-primary); outline-offset: 0px;'
            : ''
        }}"
      >
        <span class="flex items-center gap-2 min-w-0">
          <!-- Ícono prefix (slot vía ng-content, o lo pasan por input) -->
          <ng-content select="[prefix]" />
          <span
            class="truncate"
            [class.text-stone-900]="selectedLabel() !== placeholder"
            [class.text-stone-400]="selectedLabel() === placeholder"
          >
            {{ selectedLabel() }}
          </span>
        </span>
        <!-- Chevron -->
        <svg
          class="w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200"
          [class.rotate-180]="open()"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Dropdown -->
      @if (open()) {
        <div
          class="absolute z-50 mt-1.5 w-full bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden"
          style="min-width: 100%"
        >
          <div class="py-1 max-h-60 overflow-y-auto">
            @for (opt of allOptions(); track opt.value) {
              <button
                type="button"
                (click)="select(opt)"
                class="w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors duration-100 text-left"
                [class.font-semibold]="isSelected(opt)"
                [class.text-stone-900]="!isSelected(opt)"
                [style.background]="isSelected(opt) ? 'var(--color-primary)08' : ''"
                [style.color]="isSelected(opt) ? 'var(--color-primary)' : ''"
                (mouseenter)="hoveredValue.set(opt.value)"
                (mouseleave)="hoveredValue.set(null)"
                [style.backgroundColor]="
                  isSelected(opt)
                    ? 'color-mix(in srgb, var(--color-primary) 8%, white)'
                    : hoveredValue() === opt.value
                      ? '#f8f8f8'
                      : 'transparent'
                "
              >
                <span>{{ opt.label }}</span>
                @if (isSelected(opt)) {
                  <svg
                    class="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AppSelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() value: any = null;
  @Input() placeholder = 'Seleccioná una opción';
  /** Si se pasa nullLabel, se agrega una opción con value=null al principio */
  @Input() nullLabel: string | null = null;
  @Output() valueChange = new EventEmitter<any>();

  open = signal(false);
  hoveredValue = signal<any>(null);

  constructor(private elRef: ElementRef) {}

  allOptions = computed<SelectOption[]>(() => {
    const base = this.nullLabel !== null ? [{ label: this.nullLabel, value: null }] : [];
    return [...base, ...this.options];
  });

  selectedLabel = computed(() => {
    const found = this.allOptions().find((o) => o.value === this.value);
    return found ? found.label : this.placeholder;
  });

  isSelected(opt: SelectOption) {
    return opt.value === this.value;
  }

  toggle() {
    this.open.update((v) => !v);
  }

  select(opt: SelectOption) {
    this.valueChange.emit(opt.value);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }
}
