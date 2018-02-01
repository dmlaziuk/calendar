Rails.application.routes.draw do
  get 'calendar/index'
  root 'calendar#index'
  resources :events
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
