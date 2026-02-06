import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormWrapper,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormProps } from "@/types";

export default function Form<T extends Record<string, unknown>>(
  props: FormProps<T>,
) {
  const { form, inputs, onSubmit, submitText, className, additionalContent } =
    props;

  useEffect(() => {
    inputs.forEach((input) => {
      if (input.hidden && input.defaultValue !== undefined) {
        form.setValue(input.name, input.defaultValue as never);
      }
    });
  }, [form, inputs]);

  return (
    <FormWrapper {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
        className={cn(
          "container flex max-w-lg flex-col gap-4 rounded-md bg-linear-to-b from-gray-50 to-gray-100 px-3 py-6 shadow-[0_0_8px_rgba(0,0,0,0.1)]",
          className,
        )}
      >
        {inputs.map((input) => (
          <FormField
            key={input.name as string}
            control={form.control}
            name={input.name}
            render={({ field }) => {
              let InputItem;

              switch (input.type) {
                case "textarea": {
                  const { value, ...textareaField } = field;
                  InputItem = (
                    <Textarea
                      {...textareaField}
                      {...((input.defaultValue as string)
                        ? { defaultValue: input.defaultValue as string }
                        : { value: (value ?? "") as string })}
                      className={input.className as string}
                    />
                  );
                  break;
                }
                case "checkbox": {
                  const { value, ...checkboxField } = field;

                  InputItem = (
                    <Checkbox
                      {...checkboxField}
                      checked={
                        value !== undefined
                          ? Boolean(value)
                          : Boolean(input.defaultChecked)
                      }
                      onCheckedChange={field.onChange}
                      className={input.className as string}
                    />
                  );
                  break;
                }
                default: {
                  const { value, ...inputField } = field;
                  InputItem = (
                    <Input
                      {...inputField}
                      type={input.type}
                      {...((input.defaultValue as string)
                        ? { defaultValue: input.defaultValue as string }
                        : { value: (value ?? "") as string | number })}
                      {...(input.type === "number" &&
                        form.register(input.name, { valueAsNumber: true }))}
                      className={input.className as string}
                    />
                  );
                  break;
                }
              }

              return (
                <FormItem hidden={!!input.hidden}>
                  {input.label && (
                    <FormLabel>
                      {input.label}{" "}
                      {(input.required || input.required === undefined) &&
                        input.type !== "checkbox" &&
                        "*"}
                    </FormLabel>
                  )}
                  <FormControl>{InputItem}</FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}
        {form.formState.errors?.root && (
          <p className="text-destructive text-sm font-medium">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <LoaderCircle className="size-5 animate-spin" />
          ) : (
            submitText
          )}
        </Button>
        {additionalContent && additionalContent}
      </form>
    </FormWrapper>
  );
}
