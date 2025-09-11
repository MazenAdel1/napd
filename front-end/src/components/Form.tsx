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
import { Checkbox } from "./ui/checkbox";
import type { FormProps } from "@/types";

export default function Form<T extends Record<string, unknown>>(
  props: FormProps<T>
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
          "container flex flex-col gap-4 py-6 px-3 shadow-lg rounded-md max-w-lg bg-gray-100",
          className
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
                case "textarea":
                  InputItem = (
                    <Textarea
                      {...field}
                      value={
                        (field.value as HTMLInputElement["value"]) ||
                        input.defaultValue
                      }
                      className={input.className as string}
                    />
                  );
                  break;
                case "checkbox":
                  InputItem = (
                    <Checkbox
                      {...field}
                      value={field.value as HTMLInputElement["value"]}
                      onCheckedChange={field.onChange}
                      className={input.className as string}
                    />
                  );
                  break;
                default:
                  InputItem = (
                    <Input
                      {...field}
                      type={input.type}
                      value={
                        (field.value as HTMLInputElement["value"]) ||
                        input.defaultValue
                      }
                      {...(input.type === "number" &&
                        form.register(input.name, { valueAsNumber: true }))}
                      className={input.className as string}
                    />
                  );
                  break;
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
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <LoaderCircle className="animate-spin size-5" />
          ) : (
            submitText
          )}
        </Button>
        {additionalContent && additionalContent}
      </form>
    </FormWrapper>
  );
}
