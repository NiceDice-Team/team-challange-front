"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { reviewServices } from "@/services/reviewServices";
import { isAuthenticated } from "@/lib/tokenManager";
import { showCustomToast } from "@/components/shared/Toast";

interface ProductReviewDialogProps {
  productId: string;
  productName?: string;
  buttonClassName?: string;
  buttonLabel?: string;
}

const INITIAL_RATING = "5";

export default function ProductReviewDialog({
  productId,
  productName,
  buttonClassName = "",
  buttonLabel,
}: ProductReviewDialogProps) {
  const { t } = useTranslation();
  const resolvedButtonLabel = buttonLabel ?? t("product.reviewDialog.button");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(INITIAL_RATING);
  const [comment, setComment] = useState("");

  const isUserAuthenticated = isAuthenticated();

  const resetForm = () => {
    setRating(INITIAL_RATING);
    setComment("");
  };

  const createReviewMutation = useMutation({
    mutationFn: () =>
      reviewServices.createProductReview(productId, {
        rating: Number(rating).toFixed(2),
        comment: comment.trim(),
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["product", productId] }),
        queryClient.invalidateQueries({ queryKey: ["product-reviews-summary", productId] }),
        queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] }),
      ]);

      showCustomToast({
        type: "success",
        title: t("product.reviewDialog.toastSuccessTitle"),
        description: t("product.reviewDialog.toastSuccessDescription"),
      });

      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      showCustomToast({
        type: "error",
        title: t("product.reviewDialog.toastErrorTitle"),
        description: error instanceof Error ? error.message : t("product.reviewDialog.toastErrorDescription"),
      });
    },
  });

  const ratingOptions = useMemo(
    () => [
      { value: "5", label: t("product.reviewDialog.rating5") },
      { value: "4", label: t("product.reviewDialog.rating4") },
      { value: "3", label: t("product.reviewDialog.rating3") },
      { value: "2", label: t("product.reviewDialog.rating2") },
      { value: "1", label: t("product.reviewDialog.rating1") },
    ],
    [t],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isUserAuthenticated || createReviewMutation.isPending) {
      return;
    }

    createReviewMutation.mutate();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
      createReviewMutation.reset();
    }
  };

  return (
    <>
      <button type="button" className={buttonClassName} onClick={() => setOpen(true)}>
        {resolvedButtonLabel}
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="z-50 max-w-[560px] rounded-none border border-[var(--color-light-purple-2)] bg-white p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-left text-2xl font-medium uppercase text-black">
              {t("product.reviewDialog.title")}
            </DialogTitle>
          </DialogHeader>

          {!isUserAuthenticated ? (
            <div className="space-y-6 pt-2">
              <p className="text-base leading-6 text-black">
                {t("product.reviewDialog.loginRequired")}
                {productName ? t("product.reviewDialog.loginRequiredProductSuffix", { productName }) : ""}.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-none bg-[var(--color-purple)] px-6 py-3 text-sm uppercase text-white hover:opacity-90">
                  <Link href="/login">{t("product.reviewDialog.goToLogin")}</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none border-[var(--color-purple)] px-6 py-3 text-sm uppercase text-[var(--color-purple)]"
                  onClick={() => setOpen(false)}
                >
                  {t("product.reviewDialog.close")}
                </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="review-rating" className="text-sm font-medium uppercase text-black">
                  {t("product.reviewDialog.ratingLabel")}
                </Label>
                <CustomSelect
                  className="h-12 rounded-none border-[var(--color-light-purple-2)] text-black"
                  value={rating}
                  onValueChange={setRating}
                  options={ratingOptions}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-comment" className="text-sm font-medium uppercase text-black">
                  {t("product.reviewDialog.commentLabel")}
                </Label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={6}
                  maxLength={1000}
                  placeholder={t("product.reviewDialog.commentPlaceholder")}
                  className="w-full rounded-none border border-[var(--color-light-purple-2)] px-4 py-3 text-base text-black outline-none transition focus:border-[var(--color-purple)]"
                />
                <p className="text-sm text-[var(--color-gray-2)]">{comment.length}/1000</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none border-[var(--color-purple)] px-6 py-3 text-sm uppercase text-[var(--color-purple)]"
                  onClick={() => setOpen(false)}
                >
                  {t("product.reviewDialog.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="rounded-none bg-[var(--color-purple)] px-6 py-3 text-sm uppercase text-white hover:opacity-90"
                  disabled={createReviewMutation.isPending}
                >
                  {createReviewMutation.isPending ? t("product.reviewDialog.submitting") : t("product.reviewDialog.submitReview")}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
