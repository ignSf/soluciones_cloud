import React, { useState, useEffect } from 'react';
import type { ProductReview, ReviewRequestDto } from '../../types';
import { reviewService } from '../../services/reviewService';
import { RatingStars } from '../common/RatingStars';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, MessageSquarePlus, Send } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const list = await reviewService.getProductReviews(productId);
      setReviews(list);
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      showToast('Campos requeridos', 'Por favor completa el título y tu comentario', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const dto: ReviewRequestDto = {
        productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      };
      const created = await reviewService.addReview(dto);
      setReviews([created, ...reviews]);
      setTitle('');
      setComment('');
      setRating(5);
      setShowForm(false);
      showToast('¡Gracias!', 'Tu reseña ha sido publicada exitosamente', 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'No se pudo enviar la reseña', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageScore =
    reviews.length > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
      : 5.0;

  return (
    <div className="product-reviews-container">
      {/* Resumen de Calificaciones */}
      <div className="reviews-summary-card">
        <div className="summary-score-box">
          <span className="summary-big-score">{averageScore.toFixed(1)}</span>
          <RatingStars rating={averageScore} size={18} />
          <span className="summary-count-label">
            Basado en {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
          </span>
        </div>

        <div className="summary-action-box">
          <button
            type="button"
            className="btn-outline-md"
            onClick={() => setShowForm(!showForm)}
          >
            <MessageSquarePlus size={16} />
            <span>{showForm ? 'Cancelar reseña' : 'Escribir una reseña'}</span>
          </button>
        </div>
      </div>

      {/* Formulario para Crear Reseña */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="review-submit-form">
          <h4 className="form-title">Tu experiencia con el producto</h4>

          <div className="form-field-group">
            <label className="field-label">Calificación general:</label>
            <RatingStars
              rating={rating}
              interactive
              size={24}
              onRatingChange={setRating}
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="review-title" className="field-label">Título de tu opinión:</label>
            <input
              id="review-title"
              type="text"
              placeholder="Ej: Excelente calidad de sonido y batería duradera"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-input"
              required
            />
          </div>

          <div className="form-field-group">
            <label htmlFor="review-comment" className="field-label">Comentario detallado:</label>
            <textarea
              id="review-comment"
              rows={3}
              placeholder="Cuéntale a otros compradores sobre tu experiencia con el producto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-textarea"
              required
            />
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-md"
            >
              <Send size={16} />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar Reseña'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Listado de Reseñas */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews-msg">Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="review-item-card">
              <div className="review-item-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <span className="reviewer-name">{rev.userName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="verified-badge">
                        <CheckCircle2 size={12} />
                        <span>Compra Verificada</span>
                      </span>
                    )}
                  </div>
                </div>
                <span className="review-date">
                  {new Date(rev.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="review-item-rating">
                <RatingStars rating={rev.rating} size={14} />
                {rev.title && <h5 className="review-item-title">{rev.title}</h5>}
              </div>

              {rev.comment && <p className="review-item-comment">{rev.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
