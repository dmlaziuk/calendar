class Event < ApplicationRecord
  validates :description, presence: true
  validates :event_date, presence: true
end
