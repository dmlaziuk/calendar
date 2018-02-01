Rails.application.routes.draw do
  get 'calendar/index'
  root 'calendar#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
