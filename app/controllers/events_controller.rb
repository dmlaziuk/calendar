class EventsController < ActionController::API
  include Response
  before_action :set_event, only: [:show, :update, :destroy]

  # GET /events
  def index
    @events = Event.all
    json_response(@events)
  end

  # POST /events
  def create
    p params
    @event = Event.create!(event_params)
    json_response(@event, :created)
  end

  # GET /events/:id
  def show
    json_response(@event)
  end

  # PUT /events/:id
  def update
    @event.update(event_params)
    head :no_content
  end

  # DELETE /events/:id
  def destroy
    @event.destroy
    head :no_content
  end

  private

  def event_params
    # whitelist params
    params.require(:event).permit(:event_date, :description)
  end

  def set_event
    @event = Event.find(params[:id])
  end
end
