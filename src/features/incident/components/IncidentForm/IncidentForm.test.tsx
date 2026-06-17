import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import IncidentForm from "./IncidentForm";
import { Incident } from "../../types/incident.types";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  inputId?: string;
  options: SelectOption[];
  onChange: (value: SelectOption | SelectOption[]) => void;
  placeholder?: string;
  isMulti?: boolean;
}

jest.mock("react-select", () => ({
  __esModule: true,
  default: ({
    inputId,
    options,
    onChange,
    placeholder,
    isMulti,
  }: SelectProps) => (
    <select
      id={inputId}
      multiple={isMulti}
      aria-label={placeholder ?? inputId}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isMulti) {
          const selected = Array.from(e.target.selectedOptions).map((o) => ({
            value: o.value,
            label: o.text,
          }));
          onChange(selected);
        } else {
          onChange({
            value: e.target.value,
            label: e.target.options[e.target.selectedIndex].text,
          });
        }
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

const mockIncidents: Incident[] = [
  {
    id: "inc-1",
    title: "Incidente existente",
    type: { id: "cat-1", name: "Infraestructura", key: "infraestructura" },
    assignees: [{ id: "user-1", name: "Ana García" }],
    observers: [{ id: "user-2", name: "Luis Pérez" }],
    tags: [{ id: "tag-1", name: "Urgente" }],
  } as Incident,
];

const mockOnClose = jest.fn();

const defaultProps = {
  incidents: mockIncidents,
  coordinates: { lat: 4.711, lng: -74.0721 },
  onClose: mockOnClose,
};

async function fillRequiredFields(user: UserEvent): Promise<void> {
  await user.type(screen.getByLabelText(/título/i), "Fuga de agua sector 3");
  await user.type(
    screen.getByLabelText(/descripción/i),
    "Se detectó una fuga en la tubería principal del sector",
  );
  await user.selectOptions(screen.getByLabelText(/categoría/i), "cat-1");
  fireEvent.change(screen.getByLabelText(/fecha de vencimiento/i), {
    target: { valueAsDate: new Date("2025-12-31") },
  });
}

describe("IncidentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderizado inicial", () => {
    it("renderiza todos los campos del formulario", () => {
      render(<IncidentForm {...defaultProps} />);

      expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/prioridad/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/fecha de vencimiento/i),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/latitud/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/longitud/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/detalles de localización/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /crear incidente/i }),
      ).toBeInTheDocument();
    });

    it("precarga las coordenadas recibidas por props", () => {
      render(<IncidentForm {...defaultProps} />);

      expect(screen.getByLabelText(/latitud/i)).toHaveValue("4.711");
      expect(screen.getByLabelText(/longitud/i)).toHaveValue("-74.0721");
    });

    it("muestra prioridad 'medium' por defecto", () => {
      render(<IncidentForm {...defaultProps} />);

      expect(screen.getByLabelText(/prioridad/i)).toHaveValue("medium");
    });

    it("el input de fecha tiene type='date'", () => {
      render(<IncidentForm {...defaultProps} />);

      expect(screen.getByLabelText(/fecha de vencimiento/i)).toHaveAttribute(
        "type",
        "date",
      );
    });

    it("renderiza sin coordenadas sin explotar", () => {
      render(<IncidentForm incidents={mockIncidents} onClose={mockOnClose} />);

      expect(screen.getByLabelText(/latitud/i)).toHaveValue("");
      expect(screen.getByLabelText(/longitud/i)).toHaveValue("");
    });
  });

  describe("Validaciones del schema", () => {
    it("muestra error si el título tiene menos de 5 caracteres", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/título/i), "abc");
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText("El título debe tener al menos 5 caracteres"),
        ).toBeInTheDocument();
      });
    });

    it("muestra error si la descripción tiene menos de 10 caracteres", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/descripción/i), "corta");
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText("La descripción debe tener al menos 10 caracteres"),
        ).toBeInTheDocument();
      });
    });

    it("muestra error si no se selecciona categoría", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/título/i), "Título válido test");
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText("La categoría es obligatoria"),
        ).toBeInTheDocument();
      });
    });

    it("muestra error si no se ingresa fecha", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await user.type(
        screen.getByLabelText(/título/i),
        "Fuga de agua sector 3",
      );
      await user.type(
        screen.getByLabelText(/descripción/i),
        "Se detectó una fuga en la tubería principal del sector",
      );
      await user.selectOptions(screen.getByLabelText(/categoría/i), "cat-1");
      fireEvent.change(screen.getByLabelText(/fecha de vencimiento/i), {
        target: { valueAsDate: null },
      });

      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText("La fecha de vencimiento es obligatoria"),
        ).toBeInTheDocument();
      });
    });

    it("muestra error si no hay latitud", async () => {
      const user = userEvent.setup();
      render(<IncidentForm incidents={mockIncidents} onClose={mockOnClose} />);

      await fillRequiredFields(user);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText("La latitud es obligatoria"),
        ).toBeInTheDocument();
      });
    });

    it("muestra error si no hay longitud", async () => {
      const user = userEvent.setup();
      render(<IncidentForm incidents={mockIncidents} onClose={mockOnClose} />);

      await fillRequiredFields(user);
      await user.type(screen.getByLabelText(/latitud/i), "4.711");
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText("La longitud es obligatoria"),
        ).toBeInTheDocument();
      });
    });

    it("no muestra errores con todos los campos requeridos completos", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/debe tener al menos/i),
        ).not.toBeInTheDocument();
        expect(screen.queryByText(/es obligatori/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Fecha de vencimiento", () => {
    it("acepta una fecha válida sin mostrar error", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText("La fecha de vencimiento es obligatoria"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Envío del formulario", () => {
    it("llama a onClose al enviar con datos válidos", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it("resetea el título tras envío exitoso", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
        expect(screen.getByLabelText(/título/i)).toHaveValue("");
      });
    });

    it("no llama a onClose si hay errores de validación", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });

    it("envía correctamente con prioridad 'high'", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.selectOptions(screen.getByLabelText(/prioridad/i), "high");
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("envía correctamente con prioridad 'low'", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.selectOptions(screen.getByLabelText(/prioridad/i), "low");
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("permite seleccionar tags opcionales y enviar", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.selectOptions(screen.getByLabelText(/etiquetas/i), ["tag-1"]);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("permite seleccionar asignados opcionales y enviar", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.selectOptions(screen.getByLabelText(/asignados/i), ["user-1"]);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("permite seleccionar observadores opcionales y enviar", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.selectOptions(screen.getByLabelText(/observadores/i), [
        "user-2",
      ]);
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("permite ingresar detalles de localización opcionales y enviar", async () => {
      const user = userEvent.setup();
      render(<IncidentForm {...defaultProps} />);

      await fillRequiredFields(user);
      await user.type(
        screen.getByLabelText(/detalles de localización/i),
        "Edificio principal, piso 3",
      );
      await user.click(
        screen.getByRole("button", { name: /crear incidente/i }),
      );

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });
});
