require 'sinatra'
require 'rubygems'
# require 'activerecord'
require 'sports_data_api'

get '/' do
  @word = "MySports"
  SportsDataApi.set_key(:nfl, ENV['NFLKEY'])
  SportsDataApi.set_access_level(:nfl, 't')
  @teams = SportsDataApi::Nfl.teams
  @all_teams = @teams.map { |t| t }
  @all_teams_names = @all_teams.map { |t| t.name }
  erb :index
end
