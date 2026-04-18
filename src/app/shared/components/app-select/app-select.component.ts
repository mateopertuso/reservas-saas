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
    <div class="relative w-full" (click)="$event.stopPropagation()" [style.zIndex]="open() ? 80 : 1">
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
          <ng-content select="[prefix]" />
          <span
            class="truncate"
            [class.text-stone-900]="selectedLabel() !== placeholderSig()"
            [class.text-stone-400]="selectedLabel() === placeholderSig()"
          >
            {{ selectedLabel() }}
          </span>
        </span>

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

      @if (open()) {
        <div
          class="absolute left-0 w-full bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden"
          style="min-width: 100%"
          [style.top]="openUp() ? 'auto' : 'calc(100% + 0.375rem)'"
          [style.bottom]="openUp() ? 'calc(100% + 0.375rem)' : 'auto'"
          [style.zIndex]="90"
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
  private optionsState = signal<SelectOption[]>([]);
  private valueState = signal<any>(null);
  readonly placeholderSig = signal('Seleccioná una opción');
  private nullLabelState = signal<string | null>(null);

  @Input() set options(value: SelectOption[]) {
    this.optionsState.set(value ?? []);
  }

  @Input() set value(value: any) {
    this.valueState.set(value);
  }

  @Input() set placeholder(value: string) {
    this.placeholderSig.set(value || 'Seleccioná una opción');
  }

  @Input() set nullLabel(value: string | null) {
    this.nullLabelState.set(value ?? null);
  }

  @Output() valueChange = new EventEmitter<any>();

  open = signal(false);
  openUp = signal(false);
  hoveredValue = signal<any>(null);

  constructor(private elRef: ElementRef) {}

  allOptions = computed<SelectOption[]>(() => {
    const nullLabel = this.nullLabelState();
    const base = nullLabel !== null ? [{ label: nullLabel, value: null }] : [];
    return [...base, ...this.optionsState()];
  });

  selectedLabel = computed(() => {
    const found = this.allOptions().find((o) => o.value === this.valueState());
    return found ? found.label : this.placeholderSig();
  });

  isSelected(opt: SelectOption) {
    return opt.value === this.valueState();
  }

  toggle() {
    const next = !this.open();

    if (next) {
      this.updatePanelDirection();
    }

    this.open.set(next);
  }

  select(opt: SelectOption) {
    this.valueChange.emit(opt.value);
    this.open.set(false);
  }

  private updatePanelDirection() {
    const hostRect = this.elRef.nativeElement.getBoundingClientRect();
    const optionCount = Math.max(this.allOptions().length, 1);
    const estimatedPanelHeight = Math.min(optionCount * 42 + 12, 252);
    const spaceBelow = window.innerHeight - hostRect.bottom;
    const spaceAbove = hostRect.top;

    this.openUp.set(spaceBelow < estimatedPanelHeight && spaceAbove > spaceBelow);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.open()) {
      this.updatePanelDirection();
    }
  }
}
