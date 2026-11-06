import React from 'react';
import { AlertCircle, ArrowLeft, Loader2, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReviewSubmission } from './hooks/useReviewSubmission';
import { ReviewSubmissionForm } from './ReviewSubmissionForm';
import { ReviewSuccessModal } from './ReviewSuccessModal';

export const ReviewSubmissionContainer: React.FC = () => {
  const {
    code,
    eligibility,
    isLoading,
    isSubmitting,
    error,
    submitError,
    submittedReview,
    handleCodeChange,
    handleLookup,
    submitReview,
    closeSuccess,
    resetLookup,
  } = useReviewSubmission();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-sand-300 shadow-sm p-5 sm:p-8 space-y-6">
        {!eligibility ? (
          <form onSubmit={handleLookup} className="space-y-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-uritorco-100 text-uritorco-800 text-[11px] font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Reseña verificada
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-sand-950">
                Ingresá el código de tu reserva
              </h2>
              <p className="text-sm text-sand-600">
                Solo los huéspedes que completaron su estadía pueden calificar el alojamiento.
                El código figura en tu voucher oficial con formato <span className="font-mono font-bold">CAP-2026-XXXX</span>.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="review-booking-code" className="text-xs font-bold uppercase tracking-wider text-sand-600">
                Código de reserva
              </label>
              <input
                id="review-booking-code"
                type="text"
                value={code}
                onChange={(event) => handleCodeChange(event.target.value)}
                placeholder="CAP-2026-8492"
                autoComplete="off"
                className="w-full rounded-xl border border-sand-300 bg-sand-50 px-4 py-3 font-mono text-sm font-bold tracking-wider text-sand-900 uppercase placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Link
                to="/reservas/consulta"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sand-600 hover:text-sand-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Consultar mi voucher
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold text-sm transition-colors cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{isLoading ? 'Verificando...' : 'Verificar reserva'}</span>
              </button>
            </div>
          </form>
        ) : eligibility.canReview ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-uritorco-700 block">
                  Calificar estadía
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-sand-950">
                  Contanos cómo fue tu experiencia
                </h2>
              </div>
              <button
                type="button"
                onClick={resetLookup}
                className="text-xs font-bold text-sand-500 hover:text-sand-800 transition-colors cursor-pointer shrink-0"
              >
                Cambiar código
              </button>
            </div>

            <ReviewSubmissionForm
              eligibility={eligibility}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onSubmit={submitReview}
            />
          </>
        ) : (
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-amber-700" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-black text-xl text-sand-950">
                No es posible calificar esta reserva
              </h2>
              <p className="text-sm text-sand-600 max-w-md mx-auto">
                {eligibility.reason || 'Verificá el estado de tu reserva para poder enviar una reseña.'}
              </p>
              <p className="text-xs text-sand-500">
                Reserva {eligibility.bookingCode} · {eligibility.accommodationName}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetLookup}
                className="px-4 py-2.5 rounded-xl bg-sand-900 hover:bg-sand-800 text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Probar con otro código
              </button>
              <Link
                to="/reservas/consulta"
                className="px-4 py-2.5 rounded-xl border border-sand-300 text-sand-800 font-display font-bold text-xs sm:text-sm hover:bg-sand-100 transition-colors"
              >
                Ir a mi voucher
              </Link>
            </div>
          </div>
        )}
      </div>

      <ReviewSuccessModal
        isOpen={Boolean(submittedReview)}
        bookingCode={submittedReview?.bookingCode ?? code}
        accommodationName={eligibility?.accommodationName ?? 'tu alojamiento'}
        onClose={closeSuccess}
      />
    </div>
  );
};
