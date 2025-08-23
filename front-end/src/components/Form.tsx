import { type UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormWrapper,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { useEffect, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import type { InputField } from "@/types";
import { Checkbox } from "./ui/checkbox";

export type FormProps = {
  form: UseFormReturn<
    Record<string, unknown>,
    unknown,
    Record<string, unknown>
  >;
  inputs: InputField[];
  onSubmit: (
    values: z.infer<typeof z.ZodObject>,
    form: UseFormReturn<
      Record<string, unknown>,
      unknown,
      Record<string, unknown>
    >
  ) => void;
  submitText: string;
  className?: ClassNameValue;
  additionalContent?: ReactNode;
};

export default function Form({
  form,
  inputs,
  onSubmit,
  submitText,
  className,
  additionalContent,
}: FormProps) {
  useEffect(() => {
    inputs.forEach((input) => {
      if (input.type == "checkbox" && input.defaultValue == undefined) {
        form.setValue(input.name, false);
      }
    });
  }, []);

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
            key={input.name}
            control={form.control}
            name={input.name}
            render={({ field }) => {
              let InputItem;

              switch (input.type) {
                case "textarea":
                  InputItem = (
                    <Textarea
                      {...field}
                      value={field.value as HTMLInputElement["value"]}
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
                      value={field.value as HTMLInputElement["value"]}
                      className={input.className as string}
                    />
                  );
                  break;
              }

              return (
                <FormItem>
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
