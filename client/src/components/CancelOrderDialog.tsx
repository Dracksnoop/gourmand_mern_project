import { Dispatch, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const PRESET_REASONS = [
  "Ordered by mistake",
  "It is taking too long",
  "Changed my mind",
  "Found a better option",
];

const OTHER = "Other";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  onConfirm: (reason: string) => Promise<void>;
};

const CancelOrderDialog = ({ open, setOpen, loading, onConfirm }: Props) => {
  const [selected, setSelected] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const reason = selected === OTHER ? note.trim() : selected;
  const canSubmit = reason.length > 0;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    await onConfirm(reason);
    setOpen(false);
    setSelected("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-semibold">Cancel this order?</DialogTitle>
        <DialogDescription className="text-xs">
          Let the restaurant know why. Orders can only be cancelled before the kitchen
          starts preparing them.
        </DialogDescription>

        <div className="flex flex-col gap-2 py-2">
          {[...PRESET_REASONS, OTHER].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(option)}
              className={cn(
                "text-left text-sm px-3 py-2 rounded-md border transition-colors",
                selected === option
                  ? "border-orange bg-amber-50 dark:bg-amber-900/20 font-medium"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              {option}
            </button>
          ))}

          {selected === OTHER && (
            <Input
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell them what went wrong"
              className="mt-1"
            />
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep order
          </Button>
          {loading ? (
            <Button disabled className="bg-red-500 hover:bg-red-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling
            </Button>
          ) : (
            <Button
              disabled={!canSubmit}
              onClick={handleConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel order
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderDialog;
